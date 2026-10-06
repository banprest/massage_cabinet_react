class Api::V1::HealthController < Api::V1Controller
  def show
    state_app = database_available? ? :ok : :error
    render json: { status: state_app, db: state_app, version: Rails.application.config.x.app_version }, status: database_available? ? :ok : :service_unavailable
  end

  private

  def database_available?
    ActiveRecord::Base.connection_pool.with_connection { |conn| conn.select_value("SELECT 1") }.present?
  rescue ActiveRecord::AdapterError
    false
  end
end
