package boundary;

import dtos.EditLearningPathDTO;
import dtos.LearningPathDetailDTO;
import enums.VisibilityEnum;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.LearningPath;
import repository.LearningPathRepository;

@Path("learningpath/")
public class LearningPathResource {
    @Inject
    LearningPathRepository repository;

    @GET
    @Path("{pathId: [0-9]}")
    public Response getById(@PathParam("pathId") Long pathId, @QueryParam("userId") Long userId) {
        try{
            return Response.ok().entity(repository.getDetailDTO(pathId, userId)).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateLearningpath(EditLearningPathDTO data, @QueryParam("userId") Long userId){
        try{
            LearningPathDetailDTO result = repository.update(data, userId);
            return Response.ok(result).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createLearningpath(EditLearningPathDTO data, @QueryParam("userId") Long userId){
        try{
            LearningPath result = repository.create(data, userId);
            return Response.ok(result).build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
    }

    @DELETE
    @Path("{pathId: [0-9]+}")
    public Response deleteLearningpath(@PathParam("pathId") Long pathId){
        try{
            repository.delete(pathId);
        } catch (Exception ex) {
            ex.printStackTrace();
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Path("{pathId: [0-9]}/next")
    public Response getNext(@PathParam("pathId") Long pathId, @QueryParam("userId") Long userId) {
        try{
            repository.getNext(pathId, userId);
            return Response.ok().build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @PUT
    @Path("{pathId: [0-9]+}/visibility")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateLearningpath(@PathParam("pathId") Long pathId, JsonObject data, @QueryParam("userId") Long userId){
        try{
            System.out.println(data);
            repository.updatePathVisibility(pathId, userId, VisibilityEnum.valueOf(data.getString("visibility")));
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
