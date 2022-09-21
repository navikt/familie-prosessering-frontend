import { Alert, BodyShort, Button, Checkbox, Heading, Modal, Textarea } from '@navikt/ds-react';
import React, { FC, useState } from 'react';
import { ITask } from '../../../typer/task';
import { useTaskContext } from '../../TaskProvider';

interface IProps {
    settÅpen: (åpen: boolean) => void;
    task: ITask;
    åpen: boolean;
}

const KommenteringModal: FC<IProps> = ({ settÅpen, task, åpen }) => {
    const { leggTilKommentar } = useTaskContext();
    const [tilManuellOppfølging, settTilManuellOppfølging] = useState<boolean>(false);
    const [kommentar, settKommentar] = useState('');
    const [feilMelding, settFeilMelding] = useState('');

    const onSuccess = () => {
        settÅpen(false);
        settFeilMelding('');
    };

    const onError = (error: string) => {
        settFeilMelding(error);
    };

    const leggTilKommentarForTask = () => {
        leggTilKommentar(
            {
                taskId: task.id,
                settTilManuellOppfølging: tilManuellOppfølging,
                kommentar,
            },
            onSuccess,
            onError
        );
    };

    return (
        <Modal
            className={'kommentering'}
            open={åpen}
            closeButton={true}
            onClose={() => {
                settÅpen(!åpen);
            }}
        >
            <Modal.Content>
                <Heading size={'medium'}>Kommenter</Heading>

                <br />
                <BodyShort>
                    Legg til kommentar og velge hvis task skal bli manuelloppfølgt
                </BodyShort>
                <br />

                <form
                    onSubmit={(event) => {
                        leggTilKommentarForTask();
                        event.preventDefault();
                    }}
                >
                    <Checkbox
                        id={'settTilManuellOppfølging-checkbox'}
                        checked={tilManuellOppfølging}
                        onChange={() => {
                            settTilManuellOppfølging(!tilManuellOppfølging);
                        }}
                    >
                        Manuell oppfølging
                    </Checkbox>
                    <br />
                    <Textarea
                        label={'Oppgi en kommentar'}
                        maxLength={500}
                        onChange={(event) => settKommentar(event.target.value)}
                        required={true}
                        className={'kommentering__textarea'}
                        value={kommentar}
                    />

                    <br />
                    {feilMelding && <Alert variant={'error'}>{feilMelding}</Alert>}
                    <Button className={'taskpanel__vislogg'}>Kommenter</Button>
                </form>
            </Modal.Content>
        </Modal>
    );
};

export default KommenteringModal;
