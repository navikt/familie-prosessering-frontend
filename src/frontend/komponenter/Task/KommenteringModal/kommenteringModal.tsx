import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Select, Textarea } from 'nav-frontend-skjema';
import 'nav-frontend-tabell-style';
import { Element, Undertittel } from 'nav-frontend-typografi';
import React, { FC, useState } from 'react';
import { avvikstyper, ITask } from '../../../typer/task';
import { useTaskContext } from '../../TaskProvider';
import { Checkbox } from '@navikt/ds-react';

interface IProps {
    settÅpen: (åpen: boolean) => void;
    task: ITask;
    åpen: boolean;
}

const KommenteringModal: FC<IProps> = ({ settÅpen, task, åpen }) => {
    const { kommenter } = useTaskContext();
    const [tilManuellOppfølging, settTilManuellOppfølging] = useState<boolean>(false);
    const [kommentar, settKommentar] = useState('');

    return (
        <Modal
            contentClass={'kommentering'}
            isOpen={åpen}
            closeButton={true}
            onRequestClose={() => {
                settÅpen(!åpen);
            }}
            contentLabel="Kommenter"
        >
            <Undertittel children={`Kommenter`} />

            <br />
            <Element children={'Legg til kommentar og velge hvis task skal bli manuelloppfølgt'} />

            <form
                onSubmit={(event) => {
                    kommenter({
                        taskId: task.id,
                        settTilManuellOppfølging: tilManuellOppfølging,
                        kommentar: kommentar,
                    });
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
                    textareaClass={'kommentering__textarea'}
                    value={kommentar}
                />

                <br />
                <Knapp className={'taskpanel__vislogg'} mini={true}>
                    Kommenter
                </Knapp>
            </form>
        </Modal>
    );
};

export default KommenteringModal;
