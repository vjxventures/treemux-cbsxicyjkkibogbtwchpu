# CodeFlow

An AI-powered visual code explanation tool that transforms complex code into interactive flowcharts with real-time streaming analysis.

## Features

- **Real-time AI Analysis**: Powered by Claude AI for intelligent code understanding
- **Interactive Flowcharts**: Built with ReactFlow for smooth, interactive visualizations
- **Multi-language Support**: JavaScript, TypeScript, Python, Java, C++, Go, Rust
- **Complexity Metrics**: Cyclomatic and cognitive complexity analysis
- **Streaming UI**: Watch the analysis happen in real-time
- **Beautiful Design**: Modern UI with shadcn/ui components

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Claude AI** - Code analysis and flowchart generation
- **ReactFlow** - Interactive node-based UI
- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first styling
- **Bun** - Fast package manager and runtime

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun run build
```

## Environment Variables

```env
ANTHROPIC_API_KEY=your_api_key_here
```

## How It Works

1. Paste any code snippet into the editor
2. Select the programming language
3. Click "Analyze Code"
4. Watch as AI generates an interactive flowchart in real-time
5. View complexity metrics and insights

## Use Cases

- **Learning**: Understand unfamiliar codebases visually
- **Code Review**: Get quick visual overview of code changes
- **Documentation**: Generate visual documentation automatically
- **Debugging**: Visualize control flow to find issues
- **Teaching**: Explain code concepts with visual aids

## Built for TreeHacks 2026

This project demonstrates the power of combining AI with interactive visualizations to make code more accessible and understandable.
