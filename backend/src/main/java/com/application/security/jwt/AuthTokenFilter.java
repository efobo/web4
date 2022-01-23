package com.application.security.jwt;

import com.application.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //try {
            String jwt = parseJwt(request);
            //System.out.println("Токен " + jwt);
            /*if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                System.out.println("Зашли в if в фильтре");
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                UserDetails userDetails = userService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                        null);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);


            } else throw new Exception();*/
            if (jwt != null) {
                if (jwtUtils.validateJwtToken(jwt)) {
                    //System.out.println("Зашли в if в фильтре");
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    String usernameFromRequest = parseUsername(request);
                    //System.out.println("Имя юзера из хедера  " + usernameFromRequest);

                    if (!username.equals(usernameFromRequest)) throw new IOException();
                        UserDetails userDetails = userService.loadUserByUsername(username);
                        //System.out.println("Пароль " + userDetails.getPassword());
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                                null);
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                } else throw new IOException();
            }
        /*} catch (Exception e) {
            System.out.println("Пришел неверный токен");
        }*/

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerName = "Authorization";
        String prefix = "Bearer ";
        String headerAuth = request.getHeader(headerName);

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith(prefix)) {
            return headerAuth.substring(prefix.length());
        }
        return null;
    }

    private String parseUsername(HttpServletRequest request) {
        String headerName = "Username";
        String headerAuth = request.getHeader(headerName);

        if (StringUtils.hasText(headerAuth)) return headerAuth;
        return null;
    }


}
