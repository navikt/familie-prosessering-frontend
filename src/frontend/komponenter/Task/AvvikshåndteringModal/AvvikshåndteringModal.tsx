import { BodyShort, Button, Heading, Modal, Select, Textarea } from '@navikt/ds-react';
import React, { FC, useState } from 'react';
import { avvikstyper, ITask } from '../../../typer/task';
import { useTaskContext } from '../../TaskProvider';

interface IProps {
    settÅpen: (åpen: boolean) => void;
    task: ITask;
    åpen: boolean;
}

const AvvikshåndteringModal: FC<IProps> = ({ settÅpen, task, åpen }) => {
    const { avvikshåndter } = useTaskContext();
    const [valgtAvvikType, settValgtAvvikType] = useState<string>();
    const [årsak, settÅrsak] = useState('');

    return (
        <Modal
            className={'avvikshåndtering'}
            open={åpen}
            onClose={() => {
                settÅpen(!åpen);
            }}
            header={{ heading: 'Avvikshåndter' }}
        >
            <Modal.Body>
                <BodyShort>Husk at avvikshåndterte tasks aldri vil bli saksbehandlet.</BodyShort>
                <br />

                <form
                    onSubmit={(event) => {
                        avvikshåndter({
                            avvikstype: valgtAvvikType as avvikstyper,
                            taskId: task.id,
                            årsak,
                        });
                        event.preventDefault();
                    }}
                >
                    <Select
                        onChange={(event) => settValgtAvvikType(event.target.value)}
                        value={valgtAvvikType}
                        label={'Velg type avvik'}
                        required={true}
                    >
                        <option value={''}>Velg avvikstype</option>
                        {Object.keys(avvikstyper).map((avvikType) => {
                            return (
                                <option key={avvikType} value={avvikType}>
                                    {avvikType}
                                </option>
                            );
                        })}
                    </Select>

                    <br />
                    <Textarea
                        label={'Oppgi en årsak til avvik'}
                        maxLength={500}
                        onChange={(event) => settÅrsak(event.target.value)}
                        required={true}
                        className={'avvikshåndtering__textarea'}
                        value={årsak}
                    />

                    <br />
                    <Button className={'taskpanel__vislogg'}>Avvikshåndter task</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default AvvikshåndteringModal;
