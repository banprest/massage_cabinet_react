module AppVersion
  def self.detect
    return ENV["KAMAL_VERSION"].first(7) if ENV["KAMAL_VERSION"].present?
    git = `git rev-parse --short=7 HEAD`
    git.strip.presence || "unknown" if $?.success?
  rescue Errno::ENOENT
    "unknown"
  end
end

Rails.application.config.x.app_version = AppVersion.detect
