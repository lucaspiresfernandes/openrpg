import type { Spell } from '@prisma/client';
import type { AxiosRequestConfig } from 'axios';
import { useContext, useState } from 'react';
import { ErrorLogger } from '../../../contexts';
import api from '../../../utils/api';
import DataContainer from '../../DataContainer';
import SpellEditorModal from '../../Modals/SpellEditorModal';
import EditorRow from './EditorRow';
import EditorRowWrapper from './EditorRowWrapper';

type SpellEditorContainerProps = {
	spells: Spell[];
	title: string;
};

export default function SpellEditorContainer(props: SpellEditorContainerProps) {
	const [loading, setLoading] = useState(false);
	const [spellModal, setSpellModal] = useState<EditorModalData<Spell>>({
		show: false,
		operation: 'create',
	});
	const [spell, setSpell] = useState(props.spells);
	const logError = useContext(ErrorLogger);

	function onModalSubmit(sp: Spell) {
		if (
			!sp.name ||
			!sp.description ||
			!sp.castingTime ||
			!sp.cost ||
			!sp.damage ||
			!sp.duration ||
			!sp.range ||
			!sp.target ||
			!sp.type
		)
			return alert(
				'Nenhum campo pode ser vazio. Para definir um campo vazio, utilize "-"'
			);

		setLoading(true);

		const config: AxiosRequestConfig =
			spellModal.operation === 'create'
				? {
						method: 'PUT',
						data: { ...sp, id: undefined },
				  }
				: {
						method: 'POST',
						data: sp,
				  };

		api('/sheet/spell', config)
			.then((res) => {
				if (spellModal.operation === 'create') {
					setSpell([...spell, { ...sp, id: res.data.id }]);
					return;
				}
				spell[spell.findIndex((_sp) => _sp.id === sp.id)] = sp;
				setSpell([...spell]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	function deleteSpell(id: number) {
		if (!confirm('Tem certeza de que deseja apagar esse item?')) return;
		setLoading(true);
		api
			.delete('/sheet/spell', { data: { id } })
			.then(() => {
				spell.splice(
					spell.findIndex((eq) => eq.id === id),
					1
				);
				setSpell([...spell]);
			})
			.catch(logError)
			.finally(() => setLoading(false));
	}

	return (
		<>
			<DataContainer
				xs={6}
				outline
				title={props.title}
				addButton={{
					onAdd: () => setSpellModal({ operation: 'create', show: true }),
					disabled: loading,
				}}>
				<EditorRowWrapper>
					{spell.map((sp) => (
						<EditorRow
							key={sp.id}
							name={sp.name}
							onEdit={() => setSpellModal({ operation: 'edit', show: true, data: sp })}
							onDelete={() => deleteSpell(sp.id)}
							disabled={loading}
						/>
					))}
				</EditorRowWrapper>
			</DataContainer>
			<SpellEditorModal
				{...spellModal}
				onHide={() => setSpellModal({ operation: 'create', show: false })}
				onSubmit={onModalSubmit}
				disabled={loading}
			/>
		</>
	);
}
