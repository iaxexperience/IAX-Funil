import type { Lead, Activity, Message, Note, Profile } from './model';
const now = new Date();
const at = (hours: number) => new Date(now.getTime()+hours*3600000).toISOString();
const rows = [
 ['Brisa Produtos de Limpeza','Marcos Oliveira','João Pessoa','PB','WhatsApp','Anúncio',4,'Controle de produção e estoque','Planilhas','Demonstração do FindFlow',3,2,5],
 ['Nordeste Saneantes','Ana Paula Santos','Campina Grande','PB','Instagram','Instagram',2,'Rastreabilidade de lotes','Sistema próprio','Diagnóstico comercial',24,1,4],
 ['CloroMax Indústria','Ricardo Almeida','Recife','PE','WhatsApp','Indicação',5,'Emissão de notas e custos','ERP legado','Enviar proposta revisada',-24,0,5],
 ['Potiguar Distribuidora','Fernanda Costa','Natal','RN','WhatsApp','Prospecção',1,'Gestão de pedidos','Planilhas','Ligação de qualificação',2,0,2],
 ['SuaveLar Amaciantes','Juliana Mendes','Fortaleza','CE','Instagram','Instagram',0,'Estoque sem integração','Planilhas','Primeiro contato',4,1,4],
 ['EcoClean Industrial','Pedro Ferreira','Caruaru','PE','WhatsApp','Contador',6,'Custo de formulações','ERP legado','Follow-up da proposta',24,0,5],
 ['LimpMais Química','Carla Ribeiro','Bayeux','PB','WhatsApp','Evento',7,'Integração de setores','ERP legado','Reunião de boas-vindas',48,0,5],
 ['Alvo Detergentes','Roberto Lima','Maceió','AL','WhatsApp','WhatsApp',3,'Controle de vendas e notas','Sistema próprio','Agendar demonstração',5,0,4],
 ['Cristal Saneantes','Beatriz Souza','Aracaju','SE','Instagram','Prospecção',8,'Processos manuais','Planilhas','',0,0,2],
] as const;
export const demoLeads: Lead[] = rows.map((r,i)=>({id:`00000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`,company:r[0],decision_maker:r[1],city:r[2],state:r[3],channel:r[4],source:r[5],stage:r[6],pain:r[7],current_system:r[8],next_action:r[9],next_at:r[9]?at(r[10]):null,unread:r[11],qualification:Array.from({length:5},(_,n)=>n<r[12]),phone:`(${r[3]==='PB'?'83':'81'}) 99912-4580`,instagram:`@${r[0].split(' ')[0]?.toLowerCase()}`,owner_id:i%3===1?'demo-2':'demo-1',segment:'Fábrica de produtos de limpeza e saneantes',revenue:'R$ 250 mil / mês',employees:'28',buying_trigger:'Expansão da fábrica',created_at:at(-48),resolved:false}));
export const demoProfiles: Profile[] = [{id:'demo-1',name:'Camila Andrade'},{id:'demo-2',name:'Lucas Martins'}];
export const demoActivities: Activity[] = demoLeads.filter(l=>l.next_at).map((l,i)=>({id:`activity-${i}`,lead_id:l.id,type:l.stage===4?'Demonstração':l.stage===2?'Diagnóstico':'Follow-up',title:l.next_action,due_at:l.next_at??at(3),owner_id:l.owner_id,status:'pendente',observation:'Alinhar as necessidades da fábrica e os próximos passos.',created_at:at(-24)}));
export const demoMessages: Message[] = demoLeads.flatMap(l=>[
 {id:`${l.id}-1`,lead_id:l.id,conversation_id:null,content:`Olá, ${l.decision_maker.split(' ')[0]}! Sou a Camila, do FindFlow. Como vocês organizam a gestão da fábrica hoje?`,direction:'outbound',status:'simulated',created_at:at(-2)},
 {id:`${l.id}-2`,lead_id:l.id,conversation_id:null,content:`Olá, Camila! Hoje usamos ${l.current_system.toLowerCase()}. Nosso maior desafio é ${l.pain.toLowerCase()}.`,direction:'inbound',status:'simulated',created_at:at(-1)},
 ...(l.id===demoLeads[0]?.id?[
 {id:`${l.id}-3`,lead_id:l.id,conversation_id:null,content:'Entendi, Marcos! O FindFlow conecta produção, estoque e vendas em um só lugar. Podemos conversar sobre a realidade da Brisa?',direction:'outbound',status:'simulated',created_at:at(-0.58)},
 {id:`${l.id}-4`,lead_id:l.id,conversation_id:null,content:'Podemos sim! Vocês conseguem controlar as fórmulas e os lotes também?',direction:'inbound',status:'simulated',created_at:at(-0.2)}]:[])
]);
export const demoNotes: Note[] = [{id:'note-1',lead_id:demoLeads[0]?.id??'',content:'Fábrica em expansão. Marcos é o sócio e decisor. Prioriza controle de lotes e fórmulas.',author_id:'demo-1',created_at:at(-24)}];
