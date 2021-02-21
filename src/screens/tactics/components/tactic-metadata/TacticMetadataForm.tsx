import {
    makeStyles,
    Theme,
    createStyles,
    FormGroup,
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    allMapsSelector,
    changeTacticBaseNumber,
    changeTacticMapName,
    changeTacticReference,
    ChangeTacticReferenceAction,
    saveTacticMetadata,
    selectedTacticIdSelector,
    selectedTacticMetadataSelector
} from '../../store/tacticsSlice';
import { MapBaseNumber } from '../../../../store/types/enums/MapBaseNumber.enum';
import { WoTMap } from '../../../../store/types/interfaces/WoTMap.interface';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formGroup: {
            // display: "flex",
            flexDirection: "row"
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
    }),
);


const TacticMetadataForm = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const maps = useSelector(allMapsSelector);
    const selectedTacticId = useSelector(selectedTacticIdSelector);
    const tacticMetadata = useSelector(selectedTacticMetadataSelector);

    const buildBaseNumberOptions = () => {
        return Object.keys(MapBaseNumber).map(baseNumberKey =>
            <MenuItem key={baseNumberKey} value={baseNumberKey}>
                {MapBaseNumber[baseNumberKey as MapBaseNumber]}
            </MenuItem>
        )
    }

    const buildMapList = () => {
        return maps.map((map: WoTMap) => {
            return <MenuItem key={map.arena_id} value={map.name_i18n}>
                {map.name_i18n}
            </MenuItem>
        })
    }

    const isFormValid = () => {
        return Boolean(tacticMetadata.baseNumber) && Boolean(tacticMetadata.tacticReference) && Boolean(tacticMetadata.mapName)
    }

    useEffect(() => {
        if (!!selectedTacticId) {
        }
        if (!!tacticMetadata) {
        }
    }, [tacticMetadata, selectedTacticId])


    const onChangeMapName = useCallback((event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const mapName = event.target.value as string;
        dispatch(changeTacticMapName({ mapName }))
    }, [dispatch, tacticMetadata])

    const onChangeTacticReference = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const tacticReference = event.target.value as string;
        dispatch(changeTacticReference({ tacticReference } as ChangeTacticReferenceAction))
    }, [dispatch, tacticMetadata])

    const onChangeBaseNumber = useCallback((event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        const baseNumber = MapBaseNumber[event.target.value as MapBaseNumber];
        dispatch(changeTacticBaseNumber({ baseNumber }))
    }, [dispatch, tacticMetadata])

    const onClickSaveForm = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(saveTacticMetadata(tacticMetadata))
    }, [dispatch, tacticMetadata])




    const buildTacticMetadataFormGroup = () => {
        return <FormGroup className={classes.formGroup}>
            <FormControl className={classes.formControl}>
                <TextField
                    required
                    label="Tactic Name"
                    value={tacticMetadata.tacticReference}
                    onChange={onChangeTacticReference}
                />
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel id="map-form-control">Map</InputLabel>
                <Select
                    labelId="map-form-control"
                    id="map-select"
                    value={tacticMetadata.mapName}
                    onChange={onChangeMapName}
                >
                    {buildMapList()}
                </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
                <InputLabel id="base-number-form-control">Base Number</InputLabel>
                <Select
                    labelId="base-number-form-control"
                    id="base-number-select"
                    value={tacticMetadata.baseNumber}
                    onChange={onChangeBaseNumber}
                >
                    {buildBaseNumberOptions()}
                </Select>
            </FormControl>
            <Button
                variant="outlined"
                color="primary"
                onClick={onClickSaveForm}
                disabled={!isFormValid()}
            >
                Save Metadata
            </Button>
        </FormGroup>
    }

    return <div>
        {buildTacticMetadataFormGroup()}
    </div>
}

export default TacticMetadataForm;