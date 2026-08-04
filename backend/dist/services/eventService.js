"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = getEvents;
exports.getEventById = getEventById;
exports.getEventTypeCounts = getEventTypeCounts;
const supabase_1 = require("./supabase");
const TABLE = 'events';
/**
 * Strip venue when mode is Online — enforced server-side as a safety net.
 */
function sanitizeEvent(raw) {
    const event = raw;
    if (event.mode === 'Online') {
        event.venue = null;
    }
    return event;
}
/**
 * Fetch a paginated, filtered, sorted list of events.
 */
async function getEvents(params) {
    const { search, type, platform, mode, fee, eligibility, upcoming, sort = 'deadline_asc', page = 1, limit = 12, } = params;
    const offset = (page - 1) * limit;
    // ── Build query ────────────────────────────────────────────
    let query = supabase_1.supabase
        .from(TABLE)
        .select('*', { count: 'exact' });
    // Filter: type (supports single value or comma-separated list)
    if (type) {
        const types = type.split(',').map((t) => t.trim()).filter(Boolean);
        if (types.length === 1) {
            query = query.eq('type', types[0]);
        }
        else if (types.length > 1) {
            query = query.in('type', types);
        }
    }
    // Search: case-insensitive partial match on title, organizer, eligibility
    if (search && search.trim()) {
        const term = search.trim();
        query = query.or(`title.ilike.%${term}%,organizer.ilike.%${term}%,eligibility.ilike.%${term}%`);
    }
    // Filter: platform
    if (platform) {
        query = query.ilike('platform', `%${platform}%`);
    }
    // Filter: mode
    if (mode) {
        query = query.eq('mode', mode);
    }
    // Filter: registration_fee
    if (fee) {
        if (fee.toLowerCase() === 'free') {
            query = query.or('registration_fee.ilike.%free%,registration_fee.is.null');
        }
        else if (fee.toLowerCase() === 'paid') {
            query = query.not('registration_fee', 'ilike', '%free%').not('registration_fee', 'is', null);
        }
    }
    // Filter: eligibility
    if (eligibility && eligibility.trim()) {
        query = query.ilike('eligibility', `%${eligibility.trim()}%`);
    }
    // Filter: upcoming (deadline >= now)
    if (upcoming === true) {
        query = query.gte('deadline', new Date().toISOString());
    }
    // Sort
    switch (sort) {
        case 'deadline_asc':
            query = query.order('deadline', { ascending: true, nullsFirst: false });
            break;
        case 'deadline_desc':
            query = query.order('deadline', { ascending: false, nullsFirst: true });
            break;
        case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
        case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
        default:
            query = query.order('deadline', { ascending: true, nullsFirst: false });
    }
    // Pagination
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error)
        throw new Error(error.message);
    const events = data.map(sanitizeEvent);
    return {
        success: true,
        data: events,
        total: count ?? 0,
        page,
        limit,
    };
}
/**
 * Fetch a single event by ID.
 */
async function getEventById(id) {
    const { data, error } = await supabase_1.supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();
    if (error) {
        if (error.code === 'PGRST116')
            return null; // not found
        throw new Error(error.message);
    }
    return sanitizeEvent(data);
}
/**
 * Fetch distinct event types with counts.
 */
async function getEventTypeCounts() {
    const allowedTypes = ['Hackathon', 'Workshop', 'Conference', 'Competition'];
    const { data, error } = await supabase_1.supabase
        .from(TABLE)
        .select('type');
    if (error)
        throw new Error(error.message);
    const countsMap = {
        Hackathon: 0,
        Workshop: 0,
        Conference: 0,
        Competition: 0,
    };
    data.forEach((item) => {
        if (item.type && countsMap[item.type] !== undefined) {
            countsMap[item.type]++;
        }
    });
    return allowedTypes.map((type) => ({
        type,
        count: countsMap[type] || 0,
    }));
}
//# sourceMappingURL=eventService.js.map