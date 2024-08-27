package boundary;

import dtos.FilterDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import repository.ContentRepository;

@Path("content")
public class ContentResource {
    @Inject
    ContentRepository repository;

    @POST
    @Path("search")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchContent(@QueryParam("search") String search, @QueryParam("userId") Long userId, FilterDTO filterDTO){
        try{
            return Response.ok(repository.searchContent(search, userId, filterDTO.tags())).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFullContent(){
        try{
            return Response.ok(repository.getFullContent()).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @PUT
    @Path("{contentId: [0-9]+}/approve")
    public Response approveContent(@PathParam("contentId") Long contentId, @QueryParam("userId") Long userId){
        try{
            repository.approveContent(contentId, userId);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
