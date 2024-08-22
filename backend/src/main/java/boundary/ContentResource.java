package boundary;

import dtos.FilterTagDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Tag;
import repository.ContentRepository;

import java.util.List;

@Path("content")
public class ContentResource {
    @Inject
    ContentRepository repository;

    @POST
    @Path("search")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchContent(@QueryParam("search") String search, @QueryParam("userId") Long userId, FilterTagDTO tags){
        try{
            return Response.ok(repository.searchContent(search, userId, tags.tags())).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }
}
