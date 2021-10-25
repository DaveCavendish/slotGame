import { Howl } from "howler"

export class AudioManager
{
    private sounds: Map<string, Howl> = new Map();
    public constructor()
    {
    }


    public addSound(name: string, audioFileMP3: string)
    {
        const sound = new Howl({src: [audioFileMP3]})
        this.sounds.set(name, sound);
    }

    public playSound(name: string)
    {
        this.sounds.get(name)?.play();
    }
}