<div align="center">

# Moodvie

[![Moodvie](https://moodvie.edwardcs.com/favicon.ico)](https://moodvie.edwardcs.com/)

### **Get movie recommendations based on your mood and music taste.**

Moodvie that takes your recently listened to songs from Spotify and recommends you movies with the help of AI. The app is built with the T3 stack, which is based on Next.js, tRPC, Tailwind CSS, TypeScript, and Prisma. It also uses Clerk for authentication and the APIs from Spotify, OpenAI (gpt-3.5-turbo), and TMDB. 

</div>

## Moodvie App
### [Moodvie 🍿](https://moodvie.edwardcs.com/)
![moodvie](https://user-images.githubusercontent.com/9148855/236710559-01377a7a-c219-4969-b41c-e4570c40028e.gif)

## Table of Contents
* [Features](#features)
* [Usage](#usage)
* [Setup project](#setup-project)
   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
* [Built With](#built-with)
* [Contributing](#contributing)

## Features <a name="features"></a>

* Retrieve recently listened to songs from the user's Spotify account
* Generate movie recommendations based on the user's mood and music taste using OpenAI's GPT-3.5 Turbo
* Display movie information and images from TMDB

## Usage <a name="usage"></a>

To use Moodvie, you need to sign in with your Spotify account. Once you're signed in, Moodvie will retrieve your recently listened to tracks and analyze them to determine your mood. Then, it will recommend movies based on your mood.

## App Architecture

The Moodvie app is built with the T3 stack, which is based on Next.js, tRPC, Tailwind CSS, TypeScript, and Prisma. It also uses Clerk for authentication and the APIs from Spotify, OpenAI (gpt-3.5-turbo), and TMDB.

The app consists of the following components:

* **Frontend:** The frontend is built with Next.js and Tailwind CSS. It communicates with the backend via tRPC API calls.

* **Backend:** The backend is built with tRPC, which provides typesafe APIs for the frontend. It communicates with the Spotify, OpenAI, and TMDB APIs to retrieve user data and movie recommendations.

* **Database:** The database is built with Prisma, which provides a typesafe ORM for Node.js and TypeScript.

* **Authentication:** Authentication is handled by Clerk, which provides user authentication and management functionality.

The frontend and backend communicate with each other via tRPC API calls, which ensures type safety and eliminates the need for manual serialization and deserialization. The backend communicates with the various APIs to retrieve user data and movie recommendations, and the results are passed back to the frontend.

Overall, the Moodvie app is a full-stack TypeScript application that utilizes several modern technologies and APIs to provide movie recommendations based on a user's mood and music taste.

## Setup project <a name="setup-project"></a>

### Prerequisites <a name="prerequisites"></a>

* Node.js
* A Spotify Developer account with a registered app and API credentials
* An OpenAI API key
* A TMDB API key
* Clerk API keys

### Installation <a name="installation"></a>

1. Clone the repository:
```
git clone https://github.com/edwardsavin/moodvie.git
```

2. Install dependencies:
```
cd moodvie npm install
```

3. Copy the `.env.example` file to `.env` and update the environment variables with your API keys and credentials:
```
cp .env.example .env
```

4. Start the development server:
```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Built With <a name="built-with"></a>

* [create-t3-app](https://github.com/t3-oss/create-t3-app) - Interactive CLI to start a full-stack, typesafe Next.js app
* [Next.js](https://nextjs.org/) - The React Framework
* [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
* [TypeScript](https://www.typescriptlang.org/) - A strongly typed superset of JavaScript
* [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript
* [tRPC](https://trpc.io/) - End-to-end typesafe APIs made easy
* [Clerk](https://clerk.dev/) - User authentication and management
* [Spotify API](https://developer.spotify.com/documentation/web-api/) - Access user's Spotify data
* [OpenAI API](https://beta.openai.com/docs/) - AI-powered movie recommendations using GPT-3.5 Turbo
* [TMDB API](https://www.themoviedb.org/documentation/api) - Access movie information and images

## Contributing <a name="contributing"></a>

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.
