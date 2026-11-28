import { createContext, useContext, useEffect, useState, Suspense, type ReactNode } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import type { Lead, LeadPatch, Activity, Message, Note, Profile } from './model';
import { demoLeads, demoActivities, demoMessages, demoNotes, demoProfiles } from './demo';
type Snapshot = {leads:Lead[]; activities:Activity[]; messages:Message[]; notes:Note[]; profiles:Profile[]; admin:boolean};
type ActivityPatch = Partial<Omit<Activity,'id'|'created_at'>>;
type SalesData = Snapshot & {user:User|null; demo:boolean; updateLead:(id:string,patch:LeadPatch)=>Promise<void>; addLead:(patch:LeadPatch)=>Promise<string>; addActivity:(activity:Omit<Activity,'id'|'created_at'>)=>Promise<void>; updateActivity:(id:string,patch:string|ActivityPatch)=>Promise<void>; addNote:(id:string,content:string)=>Promise<void>};
const AuthContext = createContext<User|null>(null);
const DataContext = createContext<SalesData|null>(null);
export const useSales = () => { const ctx=useContext(DataContext); if(!ctx) throw new Error('Contexto comercial indisponível'); return ctx; };
export function SalesProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null);
 const queryClient=useQueryClient();
 useEffect(()=>{ let active=true; supabase.auth.getUser().then(({data})=>{if(active)setUser(data.user)}); const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='USER_UPDATED'){setUser(session?.user??null);if(event==='SIGNED_OUT')queryClient.clear();else queryClient.invalidateQueries();}}); return()=>{active=false;subscription.unsubscribe()}; },[queryClient]);
 return <AuthContext.Provider value={user}>{user?<Suspense fallback={<div className="loading-screen">Carregando sua central comercial…</div>}><LiveData user={user}>{children}</LiveData></Suspense>:<DemoData>{children}</DemoData>}</AuthContext.Provider>;
}
async function snapshot(userId:string):Promise<Snapshot> {
 const [leads,activities,messages,notes,profiles,role]=await Promise.all([supabase.from('leads').select('*').order('created_at'),supabase.from('activities').select('*').order('due_at'),supabase.from('messages').select('*').order('created_at'),supabase.from('notes').select('*').order('created_at'),supabase.from('profiles').select('*'),supabase.from('user_roles').select('role').eq('user_id',userId).maybeSingle()]);
 for(const response of [leads,activities,messages,notes,profiles,role]) if(response.error)throw response.error;
 return {leads:leads.data??[],activities:activities.data??[],messages:messages.data??[],notes:notes.data??[],profiles:profiles.data??[],admin:role.data?.role==='admin'};
}
function LiveData({user,children}:{user:User;children:ReactNode}) {
 const queryClient=useQueryClient();
 const {data}=useSuspenseQuery({queryKey:['sales',user.id],queryFn:()=>snapshot(user.id)});
 async function refresh(){await queryClient.invalidateQueries({queryKey:['sales',user.id]});}
 const value:SalesData={...data,user,demo:false,
 updateLead:async(id,patch)=>{const result=await supabase.from('leads').update(patch).eq('id',id);if(result.error)throw result.error;await refresh();},
 addLead:async(patch)=>{const result=await supabase.from('leads').insert({...patch,company:patch.company??'',owner_id:patch.owner_id??user.id}).select('id').single();if(result.error)throw result.error;await refresh();return result.data.id;},
 addActivity:async(activity)=>{const result=await supabase.from('activities').insert(activity);if(result.error)throw result.error;await refresh();},
 updateActivity:async(id,patch)=>{const result=await supabase.from('activities').update(typeof patch==='string'?{status:patch}:patch).eq('id',id);if(result.error)throw result.error;await refresh();},
 addNote:async(id,content)=>{const result=await supabase.from('notes').insert({lead_id:id,content,author_id:user.id});if(result.error)throw result.error;await refresh();}};
 return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
function DemoData({children}:{children:ReactNode}) {
 const [data,setData]=useState<Snapshot>({leads:demoLeads,activities:demoActivities,messages:demoMessages,notes:demoNotes,profiles:demoProfiles,admin:true});
 const value:SalesData={...data,user:null,demo:true,
 updateLead:async(id,patch)=>setData(d=>({...d,leads:d.leads.map(l=>l.id===id?{...l,...patch}:l),activities:[...d.activities,{id:crypto.randomUUID(),lead_id:id,type:'Atualização',title:'Perfil do lead atualizado',due_at:new Date().toISOString(),created_at:new Date().toISOString(),owner_id:'demo-1',status:'concluída',observation:''}]})),
 addLead:async(patch)=>{const id=crypto.randomUUID(); const base=demoLeads[0];if(!base)throw new Error('Modelo indisponível');setData(d=>({...d,leads:[...d.leads,{...base,id,company:'',decision_maker:'',phone:'',instagram:'',city:'',state:'',pain:'',next_action:'',next_at:null,stage:0,unread:0,qualification:[false,false,false,false,false],...patch,created_at:new Date().toISOString()}]}));toast('Lead criado na demonstração. Entre para salvar seus dados.');return id;},
 addActivity:async(activity)=>setData(d=>({...d,activities:[...d.activities,{...activity,id:crypto.randomUUID(),created_at:new Date().toISOString()}],leads:d.leads.map(l=>l.id===activity.lead_id?{...l,next_action:activity.title,next_at:activity.due_at}:l)})),
 updateActivity:async(id,patch)=>setData(d=>({...d,activities:d.activities.map(a=>a.id===id?{...a,...(typeof patch==='string'?{status:patch}:patch)}:a)})),
 addNote:async(id,content)=>setData(d=>({...d,notes:[...d.notes,{id:crypto.randomUUID(),lead_id:id,content,author_id:'demo-1',created_at:new Date().toISOString()}]}))};
 return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
export async function runAction(action:()=>Promise<unknown>,success:string){try{await action();toast.success(success)}catch{toast.error('Não foi possível salvar. Confira sua conexão e tente novamente.')}}
