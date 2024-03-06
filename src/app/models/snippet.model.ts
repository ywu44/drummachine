export interface Snippet {
    name: string,
    fileName: string,
    src: string,
    volume: number,
    pan: number,
    lowPassFrequency: number,
    highPassFrequency: number,
    pitch: number,
    isMuted: boolean,
    playable: boolean[],
    buffer: any,
    key: string,
    startTime: number,
    endTime: number,
    swing: number
}