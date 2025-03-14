
// basic MCP requirements
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// stuff for my robot
import five from 'johnny-five';
import { AudioContext } from 'webaudio-node';
import fs from 'fs/promises';

const audioContext = new AudioContext();

export function playSound(audioBuffer) {
  const bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = audioBuffer;

  bufferSource.connect(audioContext.destination);
  bufferSource.start();
  bufferSource.onended = () => {
    bufferSource.disconnect();
  };
  return bufferSource;
}

async function main() {

    const board = new five.Board({ repl: false });
    let servo;

    board.on('ready', () => {
        servo = new five.Servo({
            pin: 10,
            range: [0, 180],
            startAt: 0
        });
    });

    const soundFile = await fs.readFile('./hasta.mp3');
    const hasta = await audioContext.decodeAudioData(soundFile);

  const server = new McpServer({
    name: 'My Robot Service',
    version: '1.0.0',
    description: `A service that controls
    a robot named arnold's arm with a servo`,
  });

  server.tool(
    'moveMyServo',
    {
      degrees: z.number().int().min(0).max(180),
    },
    async ({ degrees }) => {
      let reply = 'servo not ready';
      if (servo) {
        servo.to(degrees);
        reply = `moved servo to ${degrees} degrees.  Hasta la vista, baby!`;
        playSound(hasta);
      }
      return {
        content: [
          {
            type: 'text',
            text: reply,
          },
        ],
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

}

main();
