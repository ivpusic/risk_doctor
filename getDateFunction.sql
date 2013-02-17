create function public.getdate() returns timestamptz
       stable language sql as 'select now()';
