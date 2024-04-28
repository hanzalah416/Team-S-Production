import React, { useRef, useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Box, Typography, Slider, IconButton, Stack } from '@mui/material';
import { PauseRounded, PlayArrowRounded, FastForwardRounded, FastRewindRounded, VolumeUpRounded, VolumeDownRounded } from '@mui/icons-material';
import song1 from "./music1.mp3";
import song2 from "./music2.mp3";
import song3 from "./music3.mp3";
interface Song {
    src: string;
    title: string;
    artist: string;
    album: string;
    cover: string;
}

const Widget = styled('div')(({ theme }) => ({
    padding: 5,
    borderRadius: 16,
    width: 300,
    height: 120,
    maxWidth: '100%',
    margin: 'auto',
    position: 'relative',
    zIndex: 1,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
    backdropFilter: 'blur(40px)',
}));

// const CoverImage = styled('div')({
//     width: 100,
//     height: 100,
//     objectFit: 'cover',
//     overflow: 'hidden',
//     flexShrink: 0,
//     borderRadius: 8,
//     backgroundColor: 'rgba(0,0,0,0.08)',
//     '& > img': {
//         width: '100%',
//     },
// });

const TinyText = styled(Typography)({
    fontSize: '0.75rem',
    opacity: 0.38,
    fontWeight: 500,
    letterSpacing: 0.2,
});

export default function MusicPlayerSlider() {
    const theme = useTheme();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [songs] = useState<Song[]>([
        { src: song2, title: 'if you are surrounded by tenderness', artist: 'First Artist', album: 'First Album', cover: '/static/images/album1.jpg' },
        { src: song1, title: 'Healing piano ', artist: 'Second Artist', album: 'Second Album', cover: '/static/images/album2.jpg' },
        { src: song3, title: 'you are my sunshine', artist: 'Third Artist', album: 'Third Album', cover: '/static/images/album3.jpg' },
    ]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [paused, setPaused] = useState(true);
    const [volume, setVolume] = useState(30);

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;
        audio.src = songs[currentSongIndex].src;
        audio.load();
        audio.addEventListener('loadeddata', () => {
            if (audio) {
                setDuration(audio.duration || 0);
            }
        });

        return () => {
            audio.removeEventListener('loadeddata', () => {});
        };
    }, [currentSongIndex, songs]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play();
            setPaused(false);
        } else {
            audio.pause();
            setPaused(true);
        }
    };

    const handleSeek = (event: Event, newValue: number | number[]) => {
        const audio = audioRef.current;
        if (!audio || typeof newValue !== 'number') return;
        audio.currentTime = newValue;
        setPosition(newValue);
    };

    const handleVolumeChange = (event: Event, newValue: number | number[]) => {
        const audio = audioRef.current;
        if (!audio || typeof newValue !== 'number') return;
        audio.volume = newValue / 100;
        setVolume(newValue);
    };

    const handlePrevSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    };

    const handleNextSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    };

    const formatDuration = (value: number) => {
        const minutes = Math.floor(value / 60);
        const secondsLeft = Math.floor(value % 60);
        return `${minutes}:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;
    };

    const currentSong = songs[currentSongIndex];

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Widget>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/*<CoverImage>*/}
                    {/*    <img*/}
                    {/*        alt={`${currentSong.title} cover`}*/}
                    {/*        src={currentSong.cover}*/}
                    {/*    />*/}
                    {/*</CoverImage>*/}
                    <Box sx={{ ml: 1.5, minWidth: 0 }}>
                        {/*<Typography variant="caption" color="text.secondary" fontWeight={500}>*/}
                        {/*    {currentSong.artist}*/}
                        {/*</Typography>*/}
                        <Typography noWrap>
                            <b>{currentSong.title}</b>
                        </Typography>
                        {/*<Typography noWrap letterSpacing={-0.25}>*/}
                        {/*    {currentSong.album}*/}
                        {/*</Typography>*/}
                    </Box>
                </Box>
                <audio ref={audioRef} onTimeUpdate={() => setPosition(audioRef.current?.currentTime ?? 0)} onEnded={handleNextSong} />
                <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={position}
                    min={0}
                    max={duration}
                    onChange={handleSeek}
                    sx={{
                        color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                        height: 4,
                        '& .MuiSlider-thumb': {
                            width: 8,
                            height: 8,
                            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                            '&::before': {
                                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                            },
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow: `0px 0px 0px 8px ${
                                    theme.palette.mode === 'dark'
                                        ? 'rgb(255 255 255 / 16%)'
                                        : 'rgb(0 0 0 / 16%)'
                                }`,
                            },
                            '&.Mui-active': {
                                width: 20,
                                height: 20,
                            },
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.28,
                        },
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: -2,
                    }}
                >
                    <TinyText>{formatDuration(position)}</TinyText>
                    <TinyText>-{formatDuration(duration - position)}</TinyText>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: -1,
                    }}
                >
                    <IconButton aria-label="previous song" onClick={handlePrevSong}>
                        <FastRewindRounded fontSize="large" htmlColor={theme.palette.mode === 'dark' ? '#fff' : '#000'} />
                    </IconButton>
                    <IconButton
                        aria-label={paused ? 'play' : 'pause'}
                        onClick={togglePlayPause}
                    >
                        {paused ? (
                            <PlayArrowRounded
                                sx={{ fontSize: '3rem' }}
                                htmlColor={theme.palette.mode === 'dark' ? '#fff' : '#000'}
                            />
                        ) : (
                            <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={theme.palette.mode === 'dark' ? '#fff' : '#000'} />
                        )}
                    </IconButton>
                    <IconButton aria-label="next song" onClick={handleNextSong}>
                        <FastForwardRounded fontSize="large" htmlColor={theme.palette.mode === 'dark' ? '#fff' : '#000'} />
                    </IconButton>
                </Box>
                <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
                    <VolumeDownRounded htmlColor={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} />
                    <Slider
                        aria-label="Volume"
                        value={volume}
                        onChange={handleVolumeChange}
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                            '& .MuiSlider-track': {
                                border: 'none',
                            },
                            '& .MuiSlider-thumb': {
                                width: 24,
                                height: 24,
                                backgroundColor: '#fff',
                                '&::before': {
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                                },
                                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                    boxShadow: 'none',
                                },
                            },
                        }}
                    />
                    <VolumeUpRounded htmlColor={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'} />
                </Stack>
            </Widget>
        </Box>
    );
}
