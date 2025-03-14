# Robot Control Service

A Model Context Protocol (MCP) service that controls a robot arm with a servo motor. When the servo moves, it plays "Hasta la vista, baby!" audio clip.

## Requirements

- Node.js
- Arduino or compatible board connected via USB
- Servo motor connected to pin 10
- Speaker for audio output

## Installation

```
npm install
```

## Usage

1. Connect Arduino board via USB
2. Connect servo to pin 10
3. Run the service:

```
node index.js
```

The service exposes an MCP tool called `moveMyServo` that accepts a `degrees` parameter (0-180) to control the servo position.

## Dependencies

- @modelcontextprotocol/sdk - Model Context Protocol implementation
- johnny-five - JavaScript robotics framework
- webaudio-node - Web Audio API for Node.js
- zod - Schema validation library