import asyncio, json, sys, subprocess
import edge_tts
rot, out = sys.argv[1], sys.argv[2]
R = json.load(open(rot, encoding='utf-8'))
async def main():
    durs = {}
    for c in R['cenas']:
        f = f"{out}/{c['id']}.mp3"
        await edge_tts.Communicate(c['texto'], R['voz'], rate=R['velocidade']).save(f)
        d = subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout.strip()
        durs[c['id']] = float(d)
    json.dump(durs, open(f"{out}/duracoes.json",'w'), indent=1)
    print(durs, round(sum(durs.values()),1))
asyncio.run(main())
