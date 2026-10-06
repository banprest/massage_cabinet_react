Rails.application.config.x.app_version = ENV["KAMAL_VERSION"]&.first(7).presence || `git rev-parse --short=7 HEAD`.presence.strip rescue "unknown"
