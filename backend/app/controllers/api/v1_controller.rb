class Api::V1Controller < ApplicationController
  def health
    render json: { status: status, db: check_bd, version: Rails.application.config.x.app_version }, status: status
  end

  private

  def status
    @status ||= :ok
  end

  def check_bd
    begin
      @check_bd = if ActiveRecord::Base.connection_pool.with_connection { |conn| conn.select_value("SELECT 1") }
        :ok
      end
    rescue
      @status = :service_unavailable
      @check_bd = :error
    end
    @check_bd
  end
end
