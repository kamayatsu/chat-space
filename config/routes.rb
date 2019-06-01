Rails.application.routes.draw do
  devise_for :users
  root 'messages#index'
  resources :users, only: [:index, :edit, :update]
  resources :groups, only: [:new, :create, :edit, :update] do
    resources :messages, onlu [:index, :create]
end
