# include env_file
# FROZEN VAR DECLARATION
PWD=$(shell pwd)
PS=$(shell docker ps -a -q)
IM=$(shell docker images -q)
UID=$(shell id -u)
# Standart docker variables
NS ?= titouanfreville
REPO ?= supjiralo
NAME ?= supjiralo
VERSION ?= latest

# Project specific Variables
SHELL ?= /bin/bash

export PWD
export UID

# determine platform
ifeq (Boot2Docker, $(findstring Boot2Docker, $(shell docker info)))
	PLATFORM := OSX
else
	PLATFORM := Linux
endif

# map user and group from host to container
ifeq ($(PLATFORM), OSX)
	CONTAINER_USERNAME = root
	CONTAINER_GROUPNAME = root
	HOMEDIR = /root
	CREATE_USER_COMMAND =
	COMPOSER_CACHE_DIR = ~/dev/composer
	BOWER_CACHE_DIR = ~/dev/bower
else
	CONTAINER_USERNAME = dummy
	CONTAINER_GROUPNAME = dummy
	HOMEDIR = /home/$(CONTAINER_USERNAME)
	GROUP_ID = $(shell id -g)
	USER_ID = $(shell id -u)
	CREATE_USER_COMMAND = \
		groupadd -f -g $(GROUP_ID) $(CONTAINER_GROUPNAME) && \
		useradd -u $(USER_ID) -g $(CONTAINER_GROUPNAME) $(CONTAINER_USERNAME) && \
		mkdir -p $(HOMEDIR) &&
	COMPOSER_CACHE_DIR = /var/dev/composer
	BOWER_CACHE_DIR = /var/dev/bower
endif

# map SSH identity from host to container
DOCKER_SSH_IDENTITY ?= ~/.ssh/id_rsa
DOCKER_SSH_KNOWN_HOSTS ?= ~/.ssh/known_hosts
ADD_SSH_ACCESS_COMMAND = \
	mkdir -p $(HOMEDIR)/.ssh && \
	test -e /var/dev/id && cp /var/dev/id $(HOMEDIR)/.ssh/id_rsa ; \
	test -e /var/dev/known_hosts && cp /var/dev/known_hosts $(HOMEDIR)/.ssh/known_hosts ; \
	test -e $(HOMEDIR)/.ssh/id_rsa && chmod 600 $(HOMEDIR)/.ssh/id_rsa ;

# utility commands
AUTHORIZE_HOME_DIR_COMMAND = chown -R $(CONTAINER_USERNAME):$(CONTAINER_GROUPNAME) $(HOMEDIR) &&
EXECUTE_AS = sudo -u $(CONTAINER_USERNAME) HOME=$(HOMEDIR)

# If the first argument is one of the supported commands...
SUPPORTED_COMMANDS := composer phpunit compass bower
SUPPORTS_MAKE_ARGS := $(findstring $(firstword $(MAKECMDGOALS)), $(SUPPORTED_COMMANDS))
ifneq "$(SUPPORTS_MAKE_ARGS)" ""
	# use the rest as arguments for the command
	COMMAND_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
	# ...and turn them into do-nothing targets
	$(eval $(COMMAND_ARGS):;@:)
endif

.PHONY: build push shell run start stop rm release composer_build env_file

# nOOb user Tasks --------------------------------------------------------------
# ### LOCAL TASKS ### #
default: start_dev

dev: build up

prod: build_prod up_prod

first_test: build_test up_test

test: up_o_test

start_dev: beforehand test_require dev

start_prod: beforehand test_require prod

# ------------------------------------------------------------------------------
# Typo Tasks -------------------------------------------------------------------
beforehand:
	./scripts/welcome.sh
# ------------------------------------------------------------------------------
# Install part -----------------------------------------------------------------
test_require:
	./scripts/test_require.sh $(RSYNC_NAME)

update:
	cd dev && git pull
	sudo composer self-update
	cd dev && composer update
# ------------------------------------------------------------------------------
# Docker compose tasks ---------------------------------------------------------
build:
	docker-compose -p $(NAME) build

up:
	./scripts/check_port.sh
	docker-compose -p $(NAME) up

web:
	docker-compose -p $(NAME) up web

build_prod:
	docker-compose -p $(NAME) -f docker-compose.prod.yml build

up_prod:
	./scripts/check_port.sh
	docker-compose -p $(NAME) -f docker-compose.prod.yml up


build_test:
	docker-compose -p $(NAME) -f docker-compose.test.yml build

up_test:
	docker-compose -p $(NAME) -f docker-compose.test.yml up

up_o_test:
	docker-compose -p $(NAME) -f docker-compose.test.yml up test

cstop:
	docker-compose -p $(NAME) stop

cstart:
	docker-compose -p $(NAME) start

ckill:
	docker-compose -p $(NAME) kill

crm:
	docker-compose -p $(NAME) rm
# ------------------------------------------------------------------------------
# Other docker part ------------------------------------------------------------
clean_vfs:
	docker run -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/docker:/var/lib/docker --rm martin/docker-cleanup-volumes

stop:
	@-docker stop $(PS)

# Clean all the container stoped not forced
rm:
	@-docker rm -v $(PS)

# Clean all images not forced
rmi:
	@-docker rmi $(IM)
# ------------------------------------------------------------------------------
# Clean Part -------------------------------------------------------------------
clean_docker: clean_vfs stop rm rmi

clean: clean_docker
# ------------------------------------------------------------------------------
