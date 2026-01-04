#!/bin/bash

# sound-notification.sh - Sound Notification Hook for Claude Code Events
# Plays sounds for:
# - User confirmation requests (Notification hook)
# - Agent work completion (Stop/SubagentStop hooks)

set -euo pipefail

# Configuration
SOUND_ENABLED="${CLAUDE_SOUND_ENABLED:-true}"
CONFIRMATION_SOUND="${CLAUDE_CONFIRMATION_SOUND:-Ping}"
COMPLETION_SOUND="${CLAUDE_COMPLETION_SOUND:-Glass}"

# Function to play a specific system sound
play_sound() {
    local sound_name="$1"

    if command -v afplay >/dev/null 2>&1; then
        afplay "/System/Library/Sounds/${sound_name}.aiff" 2>/dev/null || true
    fi
}

# Main notification function
send_sound_notification() {
    # Check if sound is enabled
    if [[ "$SOUND_ENABLED" != "true" ]]; then
        return 0
    fi

    # Determine notification type based on script argument or hook context
    local hook_type="${1:-${CLAUDE_HOOK_TYPE:-}}"

    # Debug: Log hook execution to a file
    echo "$(date): Hook called with type: '$hook_type'" >> "/tmp/claude_sound_debug.log"

    if [[ "$hook_type" == "Stop" || "$hook_type" == "SubagentStop" || "$hook_type" == "completion" ]]; then
        # Agent completion notification
        echo "$(date): Playing completion sound: $COMPLETION_SOUND" >> "/tmp/claude_sound_debug.log"
        play_sound "$COMPLETION_SOUND"
    else
        # User confirmation notification (default for Notification hook)
        echo "$(date): Playing confirmation sound: $CONFIRMATION_SOUND" >> "/tmp/claude_sound_debug.log"
        play_sound "$CONFIRMATION_SOUND"
    fi

    return 0
}

# Main hook execution - pass first argument if provided
send_sound_notification "$@"
exit $?