package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
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
        return Response.ok().entity(repository.getById(pathId, userId)).build();
    }
}
