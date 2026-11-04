import { useDocumentOperation, useClient } from 'sanity'
import { useState } from 'react'
import type { DocumentActionProps, DocumentActionComponent, DocumentActionDescription } from 'sanity'

/**
 * Custom publish action that ensures only one event can be active at a time.
 * When publishing an event with isActive=true, it sets isActive=false on all other events.
 */
export function createExclusiveActivePublishAction(
  originalPublishAction: DocumentActionComponent
): DocumentActionComponent {
  const ExclusiveActivePublishAction = (props: DocumentActionProps): DocumentActionDescription | null => {
    const { draft, id } = props
    const client = useClient({ apiVersion: '2024-01-01' })
    const [isDeactivating, setIsDeactivating] = useState(false)

    const originalAction = originalPublishAction(props)

    if (!originalAction) {
      return null
    }

    // Check if the current document will be active after publish
    const willBeActive = draft?.isActive === true

    return {
      ...originalAction,
      label: isDeactivating ? 'Deaktiválás...' : originalAction.label,
      disabled: originalAction.disabled || isDeactivating,
      onHandle: async () => {
        if (willBeActive) {
          setIsDeactivating(true)
          try {
            // Find all other active events and deactivate them
            const otherActiveEvents = await client.fetch<string[]>(
              `*[_type == "event" && isActive == true && _id != $id && !(_id in path("drafts.**"))]._id`,
              { id }
            )

            // Deactivate all other active events
            for (const eventId of otherActiveEvents) {
              await client.patch(eventId).set({ isActive: false }).commit()
            }
          } catch (error) {
            console.error('Failed to deactivate other events:', error)
          }
          setIsDeactivating(false)
        }

        // Call the original publish action
        originalAction.onHandle?.()
      },
    }
  }

  return ExclusiveActivePublishAction
}
