"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const EXCLUDE_FIELDS = ["sort", "page", "limit", "fields", "searchTerm"];
class QueryBuilder {
    constructor(modelQuery, filters) {
        this.modelQuery = modelQuery;
        this.filters = Object.assign({}, filters);
    }
    // Apply search on multiple fields using regex
    search(searchableFields) {
        const searchTerm = this.filters.searchTerm;
        console.log("Search term:", searchTerm);
        if (searchTerm && searchableFields.length > 0) {
            const searchQuery = {
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery);
        }
        return this;
    }
    // Apply filters (excluding meta fields), with safe type coercion
    filter() {
        const queryObj = {};
        for (const key in this.filters) {
            if (!EXCLUDE_FIELDS.includes(key)) {
                const value = this.filters[key];
                // Try to convert numeric strings to numbers
                const parsed = Number(value);
                queryObj[key] = !isNaN(parsed) && value.trim() !== "" ? parsed : value;
            }
        }
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    // Sort the results
    sort() {
        const sortBy = this.filters.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }
    // Select specific fields
    fields() {
        if (this.filters.fields) {
            const fieldList = this.filters.fields.split(",").join(" ");
            this.modelQuery = this.modelQuery.select(fieldList);
        }
        return this;
    }
    // Apply pagination
    paginate() {
        const page = Math.max(Number(this.filters.page) || 1, 1);
        const limit = Math.max(Number(this.filters.limit) || 10, 1);
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // Build and return the query
    build() {
        return this.modelQuery;
    }
    // Generate meta data like total documents, current page, and total pages
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const page = Math.max(Number(this.filters.page) || 1, 1);
            const limit = Math.max(Number(this.filters.limit) || 10, 1);
            // Note: use unpaginated query for count
            const total = yield this.modelQuery.model.countDocuments(this.modelQuery.getQuery());
            return {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
