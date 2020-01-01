# Apps

[[toc]]

## Make your own

PIMPIM is designed in a way that it can be easily expanded by your own vue apps, drop-in style.
Make a standalone vue app in a `.js` file. Put the file in `src/shows/` and run `npm run build`.

It will then attach to `<div id="app">` in base.js (html base template).

## Standard

Included apps in PIMPIM:

### Dashboard

Collection of metrics from the other apps

### Tasks

Task management.
Mainly built with the GTD productivity methodology in mind.

The data model also supports other task management strategies, like the the Eisenhower Matrix (Urgent-Important) with priorities 1-4 representing the four importance levels. Kanban should work too, though by using another app.

### Notes

A cleaner, single-purpose interface to notes.
Uses the same document model as `Tasks`.

### Messages

General purpose messaging central.
Email is best kept in files, it is said. While that is said. Does it replicate? Does it work offline? Oh.. Right. Anyway, this may come in handy anyway (for machines sending to a common place or something)

### Journal

Work in progress