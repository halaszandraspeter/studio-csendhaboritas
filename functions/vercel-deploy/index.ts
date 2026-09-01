import { documentEventHandler } from '@sanity/functions'

export const handler = documentEventHandler(async ({ context, event }) => {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  const revalidateUrl = process.env.REVALIDATE_URL
  const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET

  console.log(`📋 ENV check: REVALIDATE_URL=${revalidateUrl ? 'set' : 'missing'}, SECRET=${revalidateSecret ? 'set' : 'missing'}`)

  // Trigger on-demand revalidation for immediate updates
  if (revalidateUrl && revalidateSecret) {
    try {
      console.log(`🔄 Calling revalidate for ${event.data._type}...`)
      const revalidateResponse = await fetch(revalidateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${revalidateSecret}`,
        },
        body: JSON.stringify({
          _type: event.data._type,
          slug: event.data.slug,
        }),
      })
      const responseText = await revalidateResponse.text()
      if (revalidateResponse.ok) {
        console.log(`✅ Revalidation triggered for ${event.data._type}: ${responseText}`)
      } else {
        console.error(`⚠️ Revalidation failed: ${revalidateResponse.status} - ${responseText}`)
      }
    } catch (err) {
      console.error('⚠️ Revalidation error:', err)
    }
  } else {
    console.log('⏭️ Skipping revalidation - env vars not set')
  }

  // Trigger Vercel deploy for full rebuild
  if (!deployHookUrl) {
    throw new Error('VERCEL_DEPLOY_HOOK_URL environment variable is not set')
  }

  const response = await fetch(deployHookUrl, { method: 'POST' })
  
  if (response.ok) {
    console.log(`✅ Vercel deploy triggered for ${event.data._type} "${event.data._id}"`)
  } else {
    console.error(`❌ Failed to trigger Vercel deploy: ${response.status}`)
  }
})