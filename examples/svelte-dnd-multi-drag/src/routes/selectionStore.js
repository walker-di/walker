import {writable} from "svelte/store";
export const activeZoneId = new writable();

// id -> item
export const selectedItems = new writable({});