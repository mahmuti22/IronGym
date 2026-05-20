-- IronGym — seed categorie e sottocategorie
-- Esegui in Supabase SQL Editor (dopo docs/supabase-schema.sql)
-- Slug univoci globali: sottocategorie usano prefisso gruppo (es. uomo-t-shirt)

-- ---------------------------------------------------------------------------
-- Categorie principali
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name, description, group_slug, parent_id, status, sort_order)
values
  (
    'uomo',
    'Uomo',
    'T-shirt, tank, joggers, hoodie e compression — pezzi da palestra con taglio preciso e materiali premium.',
    'uomo',
    null,
    'visible',
    0
  ),
  (
    'donna',
    'Donna',
    'Leggings, sports bra, set coordinati e layer tecnici — design sculpt, zero distrazioni.',
    'donna',
    null,
    'visible',
    1
  ),
  (
    'accessori',
    'Accessori Gym',
    'Guanti, cinture, straps, borracce e borse — gear essenziale per ogni sessione.',
    'accessori',
    null,
    'visible',
    2
  ),
  (
    'collezioni',
    'Collezioni',
    'New arrivals, best seller, oversize, compression e selezioni stagionali IronGym.',
    'collezioni',
    null,
    'visible',
    3
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  group_slug = excluded.group_slug,
  parent_id = excluded.parent_id,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Sottocategorie Uomo
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name, description, group_slug, parent_id, status, sort_order)
select v.slug, v.name, v.description, 'uomo', p.id, 'visible', v.sort_order
from (values
  ('uomo-t-shirt', 'T-shirt palestra', 'Taglio training, tessuti premium e fit pulito.', 10),
  ('uomo-tank-top', 'Tank top / canottiere', 'Massima libertà di movimento per spalle e braccia.', 11),
  ('uomo-hoodie', 'Hoodie / felpe', 'Calore strutturato per warm-up e uscita dalla palestra.', 12),
  ('uomo-joggers', 'Joggers', 'Taper moderno, comfort tutto il giorno.', 13),
  ('uomo-shorts', 'Shorts', 'Leg day e cardio con vestibilità stabile.', 14),
  ('uomo-compression-shirt', 'Compression shirt', 'Supporto muscolare e look tecnico.', 15),
  ('uomo-leggings', 'Leggings uomo', 'Compression fit per performance e recovery.', 16),
  ('uomo-calze-sportive', 'Calze sportive', 'Grip, traspirazione e comfort sotto carico.', 17),
  ('uomo-cappellini-accessori', 'Cappellini / accessori', 'Finish pulito per completare il kit.', 18)
) as v(slug, name, description, sort_order)
cross join public.categories p
where p.slug = 'uomo'
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  group_slug = excluded.group_slug,
  parent_id = excluded.parent_id,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Sottocategorie Donna
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name, description, group_slug, parent_id, status, sort_order)
select v.slug, v.name, v.description, 'donna', p.id, 'visible', v.sort_order
from (values
  ('donna-top-sportivi', 'Top sportivi', 'Supporto e stile per ogni tipo di sessione.', 20),
  ('donna-sports-bra', 'Sports bra', 'Supporto medio-alto, seamless feel.', 21),
  ('donna-leggings', 'Leggings', 'Sculpt fit, zero distraction.', 22),
  ('donna-shorts', 'Shorts', 'Leggeri, sicuri, pronti per HIIT e pesi.', 23),
  ('donna-t-shirt', 'T-shirt palestra', 'Minimal fuori, performante dentro.', 24),
  ('donna-hoodie', 'Hoodie / felpe', 'Layer premium pre e post workout.', 25),
  ('donna-joggers', 'Joggers', 'Silhouette pulita, tessuto pesante.', 26),
  ('donna-set-coordinati', 'Set coordinati', 'Look completo, zero pensieri.', 27),
  ('donna-calze-sportive', 'Calze sportive', 'Dettaglio tecnico per ogni passo.', 28),
  ('donna-accessori', 'Accessori', 'Completamenti essenziali per la donna attiva.', 29)
) as v(slug, name, description, sort_order)
cross join public.categories p
where p.slug = 'donna'
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  group_slug = excluded.group_slug,
  parent_id = excluded.parent_id,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Sottocategorie Accessori
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name, description, group_slug, parent_id, status, sort_order)
select v.slug, v.name, v.description, 'accessori', p.id, 'visible', v.sort_order
from (values
  ('accessori-guanti-palestra', 'Guanti palestra', 'Grip e protezione per tirate pesanti.', 30),
  ('accessori-cinture-sollevamento', 'Cinture sollevamento', 'Stabilità per squat e stacco.', 31),
  ('accessori-fasce-polsi', 'Fasce polsi', 'Supporto articolare per push pesanti.', 32),
  ('accessori-straps', 'Straps', 'Presa sicura quando il grip cede.', 33),
  ('accessori-borracce', 'Borracce', 'Idratazione in sessione.', 34),
  ('accessori-asciugamani', 'Asciugamani', 'Asciugatura rapida tra le serie.', 35),
  ('accessori-borse-palestra', 'Borse palestra', 'Trasporta tutto il tuo kit.', 36)
) as v(slug, name, description, sort_order)
cross join public.categories p
where p.slug = 'accessori'
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  group_slug = excluded.group_slug,
  parent_id = excluded.parent_id,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Sottocategorie Collezioni
-- ---------------------------------------------------------------------------
insert into public.categories (slug, name, description, group_slug, parent_id, status, sort_order)
select v.slug, v.name, v.description, 'collezioni', p.id, 'visible', v.sort_order
from (values
  ('collezioni-new-arrivals', 'New arrivals', 'Le ultime uscite IronGym.', 40),
  ('collezioni-best-seller', 'Best seller', 'I capi più scelti dalla community.', 41),
  ('collezioni-oversize', 'Oversize', 'Volume e comfort per lo street gym.', 42),
  ('collezioni-compression', 'Compression', 'Linea tecnica per performance.', 43),
  ('collezioni-summer-wear', 'Summer wear', 'Leggero e traspirante.', 44),
  ('collezioni-winter-wear', 'Winter wear', 'Layer caldi per la stagione fredda.', 45),
  ('collezioni-sale', 'Sale', 'Selezione in promozione.', 46)
) as v(slug, name, description, sort_order)
cross join public.categories p
where p.slug = 'collezioni'
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  group_slug = excluded.group_slug,
  parent_id = excluded.parent_id,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = now();
