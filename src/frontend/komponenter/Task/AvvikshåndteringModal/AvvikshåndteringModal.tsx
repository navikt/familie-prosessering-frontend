import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Select, Textarea } from 'nav-frontend-skjema';
import 'nav-frontend-tabell-style';
import { Element, Undertittel } from 'nav-frontend-typografi';
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
            contentClass={'avvikshåndtering'}
            isOpen={åpen}
            closeButton={true}
            onRequestClose={() => {
                settÅpen(!åpen);
            }}
            contentLabel="Avvikshåndter"
        >
            <Undertittel children={`Avvikshåndter`} />

            <br />
            <Element children={'Husk at avvikshåndterte tasks aldri vil bli saksbehandlet.'} />

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
                    textareaClass={'avvikshåndtering__textarea'}
                    value={årsak}
                />

                <br />
                <Knapp className={'taskpanel__vislogg'} mini={true}>
                    Avvikshåndter task
                </Knapp>
            </form>
        </Modal>
    );
};

export default AvvikshåndteringModal;
