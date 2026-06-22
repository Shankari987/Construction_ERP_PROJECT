import API from "./axios";


// GET ALL MATERIALS
export const getMaterials = async () => {

  const response = await API.get(
    "/api/v1/materials/"
  );

  return response.data;
};


// GET SINGLE MATERIAL
export const getMaterialById =
  async (id) => {

    const response =
      await API.get(
        `/api/v1/materials/${id}`
      );

    return response.data;
  };


// CREATE MATERIAL
export const createMaterial =
  async (data) => {

    const response =
      await API.post(
        "/api/v1/materials/",
        data
      );

    return response.data;
  };


// UPDATE MATERIAL
export const updateMaterial =
  async (id, data) => {

    const response =
      await API.put(
        `/api/v1/materials/${id}`,
        data
      );

    return response.data;
  };


// DEACTIVATE MATERIAL
export const deactivateMaterial =
  async (id) => {

    const response =
      await API.put(
        `/api/v1/materials/deactivate/${id}`
      );

    return response.data;
  };


// ACTIVATE MATERIAL
export const activateMaterial =
  async (id) => {

    const response =
      await API.put(
        `/api/v1/materials/activate/${id}`
      );

    return response.data;
  };


  // HARD DELETE MATERIAL
export const deleteMaterial =
  async (id) => {

    const response =
      await API.delete(
        `/api/v1/materials/${id}`
      );

    return response.data;
  };