require "swagger_helper"

RSpec.describe "Health API", type: :request do
  path "/api/v1/health" do
    get "Проверка состояния сервиса" do
      tags "System"
      produces "application/json"

      response "200", "сервис работает" do
        schema type: :object,
               properties: {
                status: { type: :string },
                db: { type: :string },
                version: { type: :string }
               },
               required: %i[status db version]

        run_test!                     # делает запрос, сверяет код и схему
      end

      response "503", "БД недоступна" do
        schema type: :object,
               properties: {
                status: { type: :string },
                db: { type: :string },
                version: { type: :string }
               },
               required: %i[status db version]

        before do
          allow(ActiveRecord::Base.connection_pool).to receive(:with_connection).and_raise(ActiveRecord::AdapterError)
        end

        run_test!
      end
    end
  end
end
