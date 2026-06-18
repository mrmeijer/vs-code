# main.tf

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80"
    }
  }
}

# String
variable "location_ai" {
  type    = string
  default = "Sweden Central"
}

# String
variable "location_web" {
  type    = string
  default = "West Europe"
}

#String
variable "web_app_name" {
  type    = string
  default = "ServiceDeskEntry"
}

#String
variable "web_app_folder" {
  type    = string
  default = "../ServiceDeskEntry/"
}

provider "azurerm" {
  features {}
}

# Resource group
resource "azurerm_resource_group" "web" {
  name     = "rg-playground-servicedesk"
  location = var.location_web
}

# Static Web App
resource "azurerm_static_web_app" "web" {
  name                = var.web_app_name
  resource_group_name = azurerm_resource_group.web.name
  location            = var.location_web

  # SKU - Free or Standard
  sku_tier = "Free"
  sku_size = "Free"

  #using swa I can create a static web app in azure with blob storage for the files
  #apparently this doesn't work I cannot seem to find token
  #repository_token = "yutfuiyutikgyuyoguo"
  #repository_branch = "master"
  #repository_url = "https://github.com/mrmeijer/vs-code/tree/bcb8c563a530c22e6bb6e509603702fa86f3a851/ServiceDeskEntry"

  tags = {
    environment = "production"
    application = "myapp"
    managed_by  = "terraform"
  }
}

resource "azurerm_storage_account" "web" {
  name                     = "servicedeskstorage2719"
  resource_group_name      = azurerm_resource_group.web.name
  location                 = var.location_web
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  access_tier              = "Cool"

  static_website {
    index_document = "index.html"
    error_404_document = "index.html"
  }
}

resource "azurerm_storage_blob" "web" {
  for_each = fileset(var.web_app_folder, "**/*")

  name = each.key
  storage_account_name = azurerm_storage_account.web.name
  storage_container_name = "$web"
  type = "Block"
  source = "${var.web_app_folder}${each.key}"
}
