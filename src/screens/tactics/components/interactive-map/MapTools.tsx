import { makeStyles, Theme, createStyles, Button } from '@material-ui/core';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import NearMeIcon from '@material-ui/icons/NearMe';
import { useDispatch, useSelector } from 'react-redux';
import { joinRoomThunk, NEW_CHAT_MESSAGE_EVENT, roomStateSelector, sendMessage } from '../../../../slices/roomSlice';
import { savePositionList } from '../../../../slices/mapInteractionSlice';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { clearTacticPositions, positionListSelector, saveTacticPositions, selectedTacticIdSelector, selectedTacticSelector } from '../../store/tacticsSlice';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        tools: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start"
        },
        tool: {
            color: (props: any) => props["cursorActive"] ? theme.palette.secondary.dark : theme.palette.primary.dark
        }
    }),
);

type ButtonState = {
    cursorActive: boolean,
    secondButtonActive: boolean,
    thirdButtonActive: boolean,
    currentButton: string,
}

const MapTools = () => {
    const [buttonState, setButtonState] = useState({
        cursorActive: false,
        secondButtonActive: false,
        thirdButtonActive: false,
        currentButton: 'cursorActive'
    } as ButtonState)
    const classes = useStyles(buttonState);
    const dispatch = useDispatch();
    const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:4000');
    const messageHistory = useRef([]);
    // const {
    //     sendMessage,
    //     lastMessage,
    //     readyState,
    // } = useWebSocket(socketUrl);

    // console.log({ messageHistory }, { sendMessage }, { lastMessage }, { readyState })

    const handleClickSendMessage = useCallback(() => {
        // sendMessage('Hello')
    }, []);

    // const connectionState = {
    //     [ReadyState.CONNECTING]: 'Connecting',
    //     [ReadyState.OPEN]: 'Open',
    //     [ReadyState.CLOSING]: 'Closing',
    //     [ReadyState.CLOSED]: 'Closed',
    //     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    // }[readyState];

    const { room, usersInRoom, hasConnectionErrors, connectionStatus } = useSelector(roomStateSelector);
    const positionList = useSelector(positionListSelector)
    // useEffect(() => {
    //     if (room === undefined || connectionStatus === "idle") {
    //         dispatch(joinRoomThunk())
    //     }
    // }, [positionList, room, connectionStatus])

    const onClickTool = useCallback((event) => {
        const cursorActive = buttonState.cursorActive
        const updatedButtonState = { ...buttonState, cursorActive: !cursorActive } as ButtonState
        setButtonState(updatedButtonState);
    }, [buttonState]);

    const onClearMap = useCallback((event) => {
        console.log("dispatching clear map")
        dispatch(clearTacticPositions())
    }, [])

    const onClickSavePositions = useCallback((event) => {
        dispatch(saveTacticPositions(positionList));
        // dispatch(sendMessage({
        //     eventType: NEW_CHAT_MESSAGE_EVENT,
        //     roomId: 1,
        //     message: positionList
        // }))
    }, [buttonState, positionList]);

    return <div className={classes.tools}>
        {/* TODO - create actions enum and create html dynamically*/}
        <Button className={classes.tool} variant="outlined" onClick={onClickTool}>
            <NearMeIcon />
        </Button>
        <Button className={classes.tool} variant="outlined" onClick={onClickSavePositions}>
            Save
            </Button>
        <Button className={classes.tool} variant="outlined" onClick={onClearMap}>
            Clear
        </Button>
    </div>
}

export default MapTools;