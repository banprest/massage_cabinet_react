Rails.application.config.x.app_version = ENV["KAMAL_VERSION"].present? ? ENV["KAMAL_VERSION"] : `git rev-parse --short HEAD`.strip rescue "unknown"
