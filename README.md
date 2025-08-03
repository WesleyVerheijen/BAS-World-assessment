# BAS-World-assessment

The chosen assessment is the *developer-challenge-secret-message*. The goal and philosophy behind the implementation is to make use of end-to-end encryption. RSA is used to share secrets between users and AES is used for message encription.

## Clone

Run the following command to clone the repository:

`git clone https://github.com/WesleyVerheijen/BAS-World-assessment`

## Install dependancies

Run the following to install dependancies:

`cd message-client && npm intall && cd ../`

## Run the Docker container and frontend

To run the required components, run:

`cd secret-message-backend && ./vendor/bin/sail up -d && ./vendor/bin/sail artisan migrate && cd ../message-client && npm run dev`

## Quick guide

Open http://localhost:8077/ in a browser, preferably in a normal tab and incognito tab. Here you can create two accounts (one per tab). Then sign in. Once signed in you see an inbox and you can open chats.

*Note:* The symmetric key exchange does not always work. The account opening the chat first has the correct one. Open developer *tools -> application*, and look for key-{id}, copy the value to the other users key when issues arrise. Additionally, this is not a production ready application. Refreshing the page from time to time might help.
