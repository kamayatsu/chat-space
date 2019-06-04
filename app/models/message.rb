class Message < ApplicationRecord
  validates :image, presence: true, unless: 'body.present?'
  validates :body, presence: true, unless: 'image.present?'

  belongs_to :group
  belongs_to :user

  mount_uploader :image, ImageUploader
end
