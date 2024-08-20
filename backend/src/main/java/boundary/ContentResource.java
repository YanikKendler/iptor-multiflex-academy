package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import repository.ContentRepository;

@Path("content")
public class ContentResource {
    @Inject
    ContentRepository repository;

    @GET
    @Path("search")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchContent(@QueryParam("search") String search, @QueryParam("userId") Long userId){
        try{
            return Response.ok(repository.searchContent(search, userId)).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }
}
