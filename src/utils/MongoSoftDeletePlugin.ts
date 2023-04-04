import mongoose from "mongoose";

export type TWithSoftDeleted = {
  deletedAt: Date | null;
}

type TDocument = TWithSoftDeleted & mongoose.Document;

const softDeletePlugin = (schema: mongoose.Schema): void => {
  schema.add({
    deletedAt: {
      type: Date,
      default: null,
    },
  });

  const typesFindQueryMiddleware = [
    "count",
    "find",
    "findOne",
    "findOneAndDelete",
    "findOneAndRemove",
    "findOneAndUpdate",
    "update",
    "updateOne",
    "updateMany",
  ];

  const setDocumentIsDeleted = async (doc: TDocument) => {
    doc.deletedAt = new Date();
    doc.$isDeleted(true);
    await doc.save();
  };

  const excludeInFindQueriesIsDeleted = async function (
    this: mongoose.Query<TDocument>,
    next: mongoose.HookNextFunction
  ) {
    this.where({ deletedAt: null });
    next();
  };

  const excludeInDeletedInAggregateMiddleware = async function (
    this: mongoose.Aggregate<any>,
    next: mongoose.HookNextFunction
  ) {
    this.pipeline().unshift({ $match: { deletedAt: null } });
    next();
  };

  schema.pre("remove", async function (
    this: TDocument,
    next: mongoose.HookNextFunction
  ) {
    await setDocumentIsDeleted(this);
    next();
  });

  typesFindQueryMiddleware.forEach((type) => {
    schema.pre(type, excludeInFindQueriesIsDeleted);
  });

  schema.pre("aggregate", excludeInDeletedInAggregateMiddleware);
};

export {
  softDeletePlugin,
};
