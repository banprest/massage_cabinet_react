require "swagger_helper"

RSpec.describe "Health API", type: :request do
  path "/api/v1/health" do
    get "Проверка состояния сервиса" do
      tags "System"
      produces "application/json"

      response "200", "сервис работает" do
        schema "$ref" => "#/components/schemas/Health"

        run_test!                     # делает запрос, сверяет код и схему
      end

      response "503", "БД недоступна" do
        schema "$ref" => "#/components/schemas/Health"

        before do
          allow(ActiveRecord::Base.connection_pool).to receive(:with_connection).and_raise(ActiveRecord::AdapterError)
        end

        run_test! do |response|
          body = JSON.parse(response.body)
          expect(body["status"]).to eq("error")
        end
      end
    end
  end
end
