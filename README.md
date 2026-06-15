# Realtime Tic-Tac-Toe

[![Live Demo](https://img.shields.io/badge/Demo-Live%20View-brightgreen?style=for-the-badge)](https://tictactoe-kompaktive.vercel.app/)

Challenge your friend online without a hassle via link-sharing, or play against Minimax AI.

![App Screenshot](https://alfiankurniadi.vercel.app/images/thumbnails/realtime-tictactoe.webp)

## 🌟 Features

- Instant multiplayer matchmaking via room code or direct link-sharing.
- Realtime spectator mode.
- Play against AI powered by Minimax algorithm.

## 🛠️ Tech Stack

| Frontend                  | Styling / UI | Backend       | Deployment |
| :------------------------ | :----------- | :------------ | :--------- |
| React.js                  | Tailwind CSS | Firebase RTDB | Vercel     |
| React Router Framework v7 | React Icons  |
| Typescript                | Motion       |
| Web Workers               |

## 🧠 Lessons Learned & Challenges

Building this project taught me a lot about the barrier of realtime syncing in general.

### Challenge #1 • Race Conditions

The most common problem.. Dealing with multiple clients sending data to the database, causing unwanted data duplication and potential desync.

#### The Solution

Use built-in Firebase `runTransaction()` to handle concurrent actions.

### Challenge #2 • Over-counting Score

The score would be incremented multiple times based on how many client are in the room. Like in challenge #1, however, the use of `runTransaction()` is not possible because incrementing a score doesn't require any conditions that would prevent a client from doing so in the first place.

#### The Solution

Restricted score writing to the winning clients only.

### Challenge #3 • UI Thread Blocking

The website will freeze and stopped responding everytime it calculates, especially on lower-end device.

#### The Solution

Offloaded the minimax AI calculations to Web Workers so the calculations ran in the background instead of in the web app itself.

### Challenge #4 • Monotonous AI Move

Because the Minimax AI always picked the optimal move, it often defaults to the same opening strategy.

#### The Solution

Since TicTacToe first move is considered the best move regardless of which cell they chose, I modified the algorithm by adding an array to collect all tied 'best moves' and make the AI selects one at random.
