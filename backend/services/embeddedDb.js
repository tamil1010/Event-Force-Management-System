const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate MongoDB-like 24-character hexadecimal ObjectId
const generateId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return timestamp + random;
};

// Initial Demo Seed Data
const getInitialSeedData = () => {
  const hashedPassword = bcrypt.hashSync('password123', 10);

  const adminId = '65e0a1b2c3d4e5f6a7b8c9d0';
  const manager1Id = '65e0a1b2c3d4e5f6a7b8c9d1';
  const manager2Id = '65e0a1b2c3d4e5f6a7b8c9d2';

  const staff1Id = '65e0a1b2c3d4e5f6a7b8c9d3';
  const staff2Id = '65e0a1b2c3d4e5f6a7b8c9d4';
  const staff3Id = '65e0a1b2c3d4e5f6a7b8c9d5';
  const staff4Id = '65e0a1b2c3d4e5f6a7b8c9d6';
  const staff5Id = '65e0a1b2c3d4e5f6a7b8c9d7';
  const staff6Id = '65e0a1b2c3d4e5f6a7b8c9d8';
  const staff7Id = '65e0a1b2c3d4e5f6a7b8c9d9';

  const event1Id = '65e0b1b2c3d4e5f6a7b8c901';
  const event2Id = '65e0b1b2c3d4e5f6a7b8c902';
  const event3Id = '65e0b1b2c3d4e5f6a7b8c903';
  const event4Id = '65e0b1b2c3d4e5f6a7b8c904';

  const users = [
    {
      _id: adminId,
      name: 'System Admin',
      email: 'admin@eventforce.com',
      password: hashedPassword,
      role: 'Admin',
      department: 'Executive Operations',
      phone: '+1 555-0199',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: manager1Id,
      name: 'Sarah Jenkins',
      email: 'manager@eventforce.com',
      password: hashedPassword,
      role: 'Event Manager',
      department: 'Event Operations',
      phone: '+1 555-0188',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: manager2Id,
      name: 'Robert Vance',
      email: 'robert.manager@eventforce.com',
      password: hashedPassword,
      role: 'Event Manager',
      department: 'Logistics & Security',
      phone: '+1 555-0177',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: staff1Id,
      name: 'John Miller',
      email: 'john.security@eventforce.com',
      password: hashedPassword,
      role: 'Staff/Force Member',
      department: 'Security',
      phone: '+1 555-0101',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Assigned',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: staff2Id,
      name: 'Alex Rivera',
      email: 'alex.crowd@eventforce.com',
      password: hashedPassword,
      role: 'Staff/Force Member',
      department: 'Crowd Control',
      phone: '+1 555-0102',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Assigned',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: staff3Id,
      name: 'Dr. Priya Sharma',
      email: 'priya.medical@eventforce.com',
      password: hashedPassword,
      role: 'Staff/Force Member',
      department: 'Medical Support',
      phone: '+1 555-0103',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: staff4Id,
      name: 'Mark Taylor',
      email: 'mark.logistics@eventforce.com',
      password: hashedPassword,
      role: 'Staff/Force Member',
      department: 'Logistics',
      phone: '+1 555-0104',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Assigned',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: staff5Id,
      name: 'David Chen',
      email: 'david.tech@eventforce.com',
      password: hashedPassword,
      role: 'Staff/Force Member',
      department: 'Tech Support',
      phone: '+1 555-0105',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: staff6Id,
      name: 'Elena Rostova',
      email: 'elena.hospitality@eventforce.com',
      password: hashedPassword,
      role: 'Staff/Force Member',
      department: 'Hospitality',
      phone: '+1 555-0106',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'Available',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: staff7Id,
      name: 'Marcus Vance',
      email: 'marcus.security@eventforce.com',
      password: hashedPassword,
      role: 'Staff/Force Member',
      department: 'Security',
      phone: '+1 555-0107',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      availabilityStatus: 'On Leave',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const events = [
    {
      _id: event1Id,
      name: 'College Cultural Festival 2026',
      description: 'Annual mega cultural festival with live performances, art exhibits, and food stalls.',
      category: 'Cultural Festival',
      date: '2026-10-15T00:00:00.000Z',
      startTime: '09:00',
      endTime: '22:00',
      location: 'Main University Auditorium & Grounds',
      requiredForce: 20,
      assignedForceCount: 3,
      status: 'Upcoming',
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      createdBy: manager1Id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: event2Id,
      name: 'Global Tech Leadership Summit',
      description: 'International conference hosting C-level executives, tech founders, and keynote panels.',
      category: 'Corporate Conference',
      date: '2026-10-22T00:00:00.000Z',
      startTime: '08:30',
      endTime: '18:00',
      location: 'Grand Convention Center, Hall B',
      requiredForce: 12,
      assignedForceCount: 2,
      status: 'Upcoming',
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      createdBy: manager1Id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: event3Id,
      name: 'Metropolitan City Marathon 2026',
      description: 'Annual 42km marathon with over 5,000 participating athletes across the city routes.',
      category: 'Sports Tournament',
      date: '2026-11-05T00:00:00.000Z',
      startTime: '05:30',
      endTime: '13:00',
      location: 'City Central Park & Main Boulevard',
      requiredForce: 35,
      assignedForceCount: 0,
      status: 'Upcoming',
      bannerUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
      createdBy: manager2Id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: event4Id,
      name: 'National E-Sports Championship',
      description: 'Pro gaming tournament featuring live arena battles, commentary stream, and VIP booths.',
      category: 'Exhibition',
      date: '2026-09-28T00:00:00.000Z',
      startTime: '10:00',
      endTime: '21:00',
      location: 'Cyber Arena Dome 4',
      requiredForce: 8,
      assignedForceCount: 3,
      status: 'Active',
      bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      createdBy: manager2Id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const assignments = [
    {
      _id: '65e0c1b2c3d4e5f6a7b8c901',
      eventId: event1Id,
      forceMemberId: staff1Id,
      assignedBy: manager1Id,
      assignedAt: new Date().toISOString(),
      status: 'Confirmed',
      roleInEvent: 'Main Stage Perimeter Lead',
      note: 'Supervise security perimeter at the main stage entrance.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '65e0c1b2c3d4e5f6a7b8c902',
      eventId: event1Id,
      forceMemberId: staff2Id,
      assignedBy: manager1Id,
      assignedAt: new Date().toISOString(),
      status: 'Confirmed',
      roleInEvent: 'Gate A Entry Coordinator',
      note: 'Manage ticket scanning lines and queue flow.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '65e0c1b2c3d4e5f6a7b8c903',
      eventId: event1Id,
      forceMemberId: staff4Id,
      assignedBy: manager1Id,
      assignedAt: new Date().toISOString(),
      status: 'Assigned',
      roleInEvent: 'Equipment & Staging Logistics',
      note: 'Assist lighting and audio vendors during sound check.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const notifications = [
    {
      _id: '65e0d1b2c3d4e5f6a7b8c901',
      recipient: staff1Id,
      sender: manager1Id,
      title: 'New Event Assignment',
      message: 'You have been assigned to College Cultural Festival 2026 as Main Stage Perimeter Lead.',
      type: 'Assignment',
      isRead: false,
      link: '/dashboard/staff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return { users, events, assignments, notifications };
};

// In-Memory Database Store Class
class LocalDatabase {
  constructor() {
    this.data = { users: [], events: [], assignments: [], notifications: [] };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('[EventForce Embedded DB] Loaded existing database from data/db.json');
      } else {
        this.data = getInitialSeedData();
        this.save();
        console.log('[EventForce Embedded DB] Initialized with demo users and events in data/db.json');
      }
    } catch (err) {
      console.warn('[EventForce Embedded DB] Failed to parse db.json, re-initializing with seed data:', err.message);
      this.data = getInitialSeedData();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      // In read-only filesystems, data will remain in memory safely
      console.warn('[EventForce Embedded DB] Could not persist to disk (running in pure RAM):', err.message);
    }
  }
}

const dbInstance = new LocalDatabase();

// Helper to deep clone objects
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// Document wrapper that adds instance methods like matchPassword and save
class DocumentWrapper {
  constructor(collectionName, data) {
    Object.assign(this, data);
    Object.defineProperty(this, '_collection', { value: collectionName, enumerable: false });
  }

  async matchPassword(enteredPassword) {
    if (!this.password) return false;
    return bcrypt.compare(enteredPassword, this.password);
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const collection = dbInstance.data[this._collection];
    const index = collection.findIndex((item) => String(item._id) === String(this._id));
    if (index !== -1) {
      collection[index] = { ...this };
    } else {
      collection.push({ ...this });
    }
    dbInstance.save();
    return this;
  }

  toObject() {
    return { ...this };
  }
}

// Query Filter Helper
const matchesQuery = (item, query = {}) => {
  for (const [key, val] of Object.entries(query)) {
    if (val === undefined) continue;

    // Handle $in operator
    if (val && typeof val === 'object' && val.$in && Array.isArray(val.$in)) {
      const itemVal = item[key];
      if (!val.$in.map(String).includes(String(itemVal))) return false;
      continue;
    }

    // Handle $regex
    if (val && typeof val === 'object' && val.$regex) {
      const regex = new RegExp(val.$regex, val.$options || '');
      if (!regex.test(String(item[key] || ''))) return false;
      continue;
    }

    // Handle $ne
    if (val && typeof val === 'object' && val.$ne !== undefined) {
      if (String(item[key]) === String(val.$ne)) return false;
      continue;
    }

    // Date comparisons
    if (val && typeof val === 'object' && (val.$gte || val.$lte || val.$gt || val.$lt)) {
      const itemDate = new Date(item[key]).getTime();
      if (val.$gte && itemDate < new Date(val.$gte).getTime()) return false;
      if (val.$lte && itemDate > new Date(val.$lte).getTime()) return false;
      if (val.$gt && itemDate <= new Date(val.$gt).getTime()) return false;
      if (val.$lt && itemDate >= new Date(val.$lt).getTime()) return false;
      continue;
    }

    // Direct match (handling ObjectIds and strings)
    if (String(item[key]) !== String(val)) {
      return false;
    }
  }
  return true;
};

// Model Query Chain (mimics Mongoose Query)
class QueryChain {
  constructor(collectionName, results) {
    this.collectionName = collectionName;
    this.results = results.map((item) => clone(item));
    this._selectFields = null;
    this._sortRules = null;
    this._limitCount = null;
    this._skipCount = 0;
    this._populates = [];
  }

  select(fields) {
    this._selectFields = fields;
    return this;
  }

  sort(sortRules) {
    this._sortRules = sortRules;
    return this;
  }

  limit(n) {
    this._limitCount = n;
    return this;
  }

  skip(n) {
    this._skipCount = n;
    return this;
  }

  populate(field, select) {
    this._populates.push({ field, select });
    return this;
  }

  _execute() {
    let items = [...this.results];

    // Sort
    if (this._sortRules) {
      items.sort((a, b) => {
        for (const [key, dir] of Object.entries(this._sortRules)) {
          let aVal = a[key];
          let bVal = b[key];
          if (aVal === bVal) continue;
          if (aVal === undefined) return 1;
          if (bVal === undefined) return -1;
          const order = dir === 1 || dir === 'asc' ? 1 : -1;
          return aVal > bVal ? order : -order;
        }
        return 0;
      });
    }

    // Skip & Limit
    if (this._skipCount) {
      items = items.slice(this._skipCount);
    }
    if (this._limitCount !== null) {
      items = items.slice(0, this._limitCount);
    }

    // Populate references
    for (const pop of this._populates) {
      for (const item of items) {
        const refId = item[pop.field];
        if (refId) {
          let refItem = null;
          // Determine target collection
          if (pop.field === 'createdBy' || pop.field === 'forceMemberId' || pop.field === 'assignedBy' || pop.field === 'recipient' || pop.field === 'sender') {
            refItem = dbInstance.data.users.find((u) => String(u._id) === String(refId));
          } else if (pop.field === 'eventId') {
            refItem = dbInstance.data.events.find((e) => String(e._id) === String(refId));
          }

          if (refItem) {
            let clonedRef = clone(refItem);
            delete clonedRef.password;
            if (pop.select) {
              const allowed = pop.select.split(' ').filter(Boolean);
              const filtered = { _id: clonedRef._id };
              for (const k of allowed) {
                if (clonedRef[k] !== undefined) filtered[k] = clonedRef[k];
              }
              clonedRef = filtered;
            }
            item[pop.field] = clonedRef;
          }
        }
      }
    }

    // Select filtering (strip passwords by default unless +password specified)
    return items.map((item) => {
      const doc = new DocumentWrapper(this.collectionName, item);
      if (this.collectionName === 'users') {
        const selectStr = this._selectFields || '';
        if (!selectStr.includes('+password')) {
          delete doc.password;
        }
      }
      return doc;
    });
  }

  then(resolve, reject) {
    try {
      const results = this._execute();
      return Promise.resolve(resolve(results));
    } catch (err) {
      return Promise.reject(reject ? reject(err) : err);
    }
  }

  catch(reject) {
    return this.then((res) => res, reject);
  }
}

// Single Document Query Chain
class SingleQueryChain extends QueryChain {
  _execute() {
    const list = super._execute();
    return list.length > 0 ? list[0] : null;
  }
}

// Factory to create Model-like objects
const createModel = (collectionName) => {
  return {
    find(query = {}) {
      const items = dbInstance.data[collectionName].filter((item) => matchesQuery(item, query));
      return new QueryChain(collectionName, items);
    },

    findOne(query = {}) {
      const items = dbInstance.data[collectionName].filter((item) => matchesQuery(item, query));
      return new SingleQueryChain(collectionName, items);
    },

    findById(id) {
      const items = dbInstance.data[collectionName].filter((item) => String(item._id) === String(id));
      return new SingleQueryChain(collectionName, items);
    },

    async create(docOrList) {
      const isArray = Array.isArray(docOrList);
      const list = isArray ? docOrList : [docOrList];
      const created = [];

      for (const item of list) {
        const newDoc = {
          _id: item._id || generateId(),
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        };

        if (collectionName === 'users' && newDoc.password && !newDoc.password.startsWith('$2a$') && !newDoc.password.startsWith('$2b$')) {
          newDoc.password = bcrypt.hashSync(newDoc.password, 10);
        }

        dbInstance.data[collectionName].push(newDoc);
        created.push(new DocumentWrapper(collectionName, newDoc));
      }

      dbInstance.save();
      return isArray ? created : created[0];
    },

    async findByIdAndUpdate(id, update, options = {}) {
      const collection = dbInstance.data[collectionName];
      const index = collection.findIndex((item) => String(item._id) === String(id));
      if (index === -1) return null;

      const updated = {
        ...collection[index],
        ...update,
        updatedAt: new Date().toISOString(),
      };

      if (collectionName === 'users' && update.password && !update.password.startsWith('$2a$') && !update.password.startsWith('$2b$')) {
        updated.password = bcrypt.hashSync(update.password, 10);
      }

      collection[index] = updated;
      dbInstance.save();

      const doc = new DocumentWrapper(collectionName, updated);
      if (collectionName === 'users') delete doc.password;
      return doc;
    },

    async findByIdAndDelete(id) {
      const collection = dbInstance.data[collectionName];
      const index = collection.findIndex((item) => String(item._id) === String(id));
      if (index === -1) return null;
      const [removed] = collection.splice(index, 1);
      dbInstance.save();
      return new DocumentWrapper(collectionName, removed);
    },

    async deleteMany(query = {}) {
      const initialLen = dbInstance.data[collectionName].length;
      dbInstance.data[collectionName] = dbInstance.data[collectionName].filter(
        (item) => !matchesQuery(item, query)
      );
      dbInstance.save();
      return { deletedCount: initialLen - dbInstance.data[collectionName].length };
    },

    async updateMany(query = {}, update = {}) {
      let count = 0;
      for (const item of dbInstance.data[collectionName]) {
        if (matchesQuery(item, query)) {
          Object.assign(item, update, { updatedAt: new Date().toISOString() });
          count++;
        }
      }
      dbInstance.save();
      return { modifiedCount: count };
    },

    async countDocuments(query = {}) {
      return dbInstance.data[collectionName].filter((item) => matchesQuery(item, query)).length;
    },

    async aggregate(pipeline = []) {
      let results = clone(dbInstance.data[collectionName]);

      for (const stage of pipeline) {
        if (stage.$match) {
          results = results.filter((item) => matchesQuery(item, stage.$match));
        } else if (stage.$group) {
          const groupField = stage.$group._id ? String(stage.$group._id).replace('$', '') : null;
          const groups = {};
          for (const item of results) {
            const key = groupField ? item[groupField] || 'General' : 'all';
            if (!groups[key]) groups[key] = { _id: key, count: 0 };
            groups[key].count += 1;
          }
          results = Object.values(groups);
        } else if (stage.$sort) {
          const [sortKey, sortDir] = Object.entries(stage.$sort)[0] || ['count', -1];
          results.sort((a, b) => (a[sortKey] > b[sortKey] ? sortDir : -sortDir));
        }
      }

      return results;
    },
  };
};

module.exports = {
  User: createModel('users'),
  Event: createModel('events'),
  Assignment: createModel('assignments'),
  Notification: createModel('notifications'),
  dbInstance,
};
