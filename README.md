# Github Release Notifier

Regularly, I find myself lurking on Github release page looking for the newest release of a library I use for one of my projects. Problem is, I don't have an option to subscribe to a repository and receive a notification when there is a new release available so I have to come back regularly and see for myself.
Thats where this little application comes handy.

This application lets you **subscribe** to a repository and notifies you when there is a new release.

This application makes use of the rss (atom) functionallity on the releases page and a background worker to check it on a schedule.

For the notifications, is necessary (for now) to have created a Telegram Bot ([how to create a telegram bot?](https://core.telegram.org/bots)).

Please read all the **"how to use"** section before running the application for the first time.

## How to use

If you are indeed going to be running this application on a Linux based server, check the `docker-compose.yml` first. There are 2 lines adding 2 volumes:

```yml
- /etc/localtime:/etc/localtime:ro
- /etc/timezone:/etc/timezone:ro
```

This helps a known bug (?) on docker that makes the container be in a different timezone than the host and therefore the date and time are off, making the worker run on a different time than scheduled.
This 2 lines are commented out because it doesn't work on all systems (for instance MacOS).

Also, the `Dockerfile` sets the timezone to `Europe/Berlin`. Feel free to change this to your own timezone before building.

Make sure you have created a `.env` file based on the `.env.template` file.
Open `.env` and change the values accordingly.
This 2 can be a little tricky:

```bash
TELEGRAM_TOKEN
TELEGRAM_CHAT_ID
```

This values you have to get them yourself from Telegram. Check https://core.telegram.org/bots.

Initially thought to be run on a docker container on a Raspberry pi or similar device.
This application does not require more than a server (or computer) with the latest node version installed.
If you have `docker-composer` simply run this command whre you have cloned this repository:

```bash
docker-compose up -d
```

This should already set up everything and you can open the browser and open `http://0.0.0.0:3000` and see the UI.
Please note that the URL will change depending where you are running docker. For instance, if you are running it on a Raspberry Pi, check what IP it has and access it there, for instance: `http://192.168.0.22:3000`.

If you rather run this application without docker.
If its the first time, run:

```bash
npm run build
```

Then start the application:

```bash
npm run start
```

Note that this application requires to be left running in the background for scheduling the routine checks.

## Conversation Bot

Sometimes is easier to let a bot do the things for you. So now you can use your Telegram Bot to run commands directly from your Telegram.

Available commands:

* **/list** - Returns the list of watched repositories.
* **/add** - Adds a new repository to the watch list.
* **/remove** - Removes a repository from the watch list.
* **/test** - Tests this bot.
* **/help** - Prints this list.

Covers most of the options you can do from the UI but the comodity of not having to open your browser.

## Limitations and known issues

- [ ] Only Telegram bot is available for the notifications.
- [ ] Depending on the system, the worker will be of times in a different timezone or the clock will not be synchronized.

## Licenses

This application is using several open source and otherwise free to use libraries.
This application is licensed under the [Apache 2 License](http://www.apache.org/licenses/LICENSE-2.0.html), meaning you can use it free of charge, without strings attached in commercial and non-commercial projects.