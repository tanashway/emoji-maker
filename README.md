# 🤓 Emoji Maker

An AI-powered emoji generator built with Next.js and Replicate's SDXL model.

## Features

- 🎨 Generate custom emojis from text descriptions
- 💾 Download generated emojis
- ❤️ Like and save your favorite emojis
- 🌙 Dark mode support
- ⚡ Real-time generation with loading animations
- 📱 Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Zustand for state management
- Replicate API for AI image generation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/emoji-maker.git
cd emoji-maker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Replicate API key:
```bash
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a descriptive prompt (e.g., "happy cat", "cool penguin")
2. Click "Generate" and wait for your emoji
3. Download or like your generated emojis
4. Your liked emojis are saved locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
