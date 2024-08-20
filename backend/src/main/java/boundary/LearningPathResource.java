package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
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
            return Response.ok().entity(repository.getById(pathId, userId)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @POST
    @Path("{pathId: [0-9]}/next")
    public Response getNext(@PathParam("pathId") Long pathId, @QueryParam("userId") Long userId) {
        try{
            repository.getNext(pathId, userId);
            return Response.ok().build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }
}
