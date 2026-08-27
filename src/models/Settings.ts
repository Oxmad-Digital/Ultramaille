import mongoose, { Schema, models, model } from "mongoose";

export interface ISettings {
  _id: mongoose.Types.ObjectId;
  key: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, required: true, unique: true, default: "site" },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default models.Settings || model<ISettings>("Settings", SettingsSchema);
