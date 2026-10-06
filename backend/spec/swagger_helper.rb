# frozen_string_literal: true

require 'rails_helper'

RSpec.configure do |config|
  config.openapi_root = Rails.root.join("swagger").to_s

  config.openapi_specs = {
    "v1/openapi.yaml" => {
      openapi: "3.0.1",
      info: { title: "Vozrozhdenie API", version: "v1" },
      paths: {},
      components: {
        schemas: {
          Health: {
            type: :object,
            properties: {
            status: { type: :string, enum: %w[ok error] },
            db: { type: :string, enum: %w[ok error] },
            version: { type: :string }
            },
            required: %i[status db version]
          }
        }
      },
      servers: [ { url: "http://localhost:3000" } ]
    }
  }

  config.openapi_format = :yaml
end
