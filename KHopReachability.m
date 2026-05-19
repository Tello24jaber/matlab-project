function [riskCounts, riskNodes, mostCritical, mostVulnerable, reachabilityMatrix] = KHopReachability(A, k)
% KHopReachability - Finds which routers can spread malware within k hops
%
% Inputs:
%   A - Adjacency matrix of the network (n x n matrix of 0s and 1s)
%   k - Maximum number of hops (contact level) for malware to spread
%
% Outputs:
%   riskCounts        - A vector, riskCounts(i) = number of routers router i can reach in k hops
%   riskNodes         - A cell array, riskNodes{i} = list of router indices reachable from router i
%   mostCritical      - The router that can reach the most other routers (most dangerous if infected)
%   mostVulnerable    - The router that can be reached by the most other routers (most exposed)
%   reachabilityMatrix - Logical matrix, entry (i,j) = true if router j is reachable from router i

    % -------------------------------------------------------
    % Step 1: Check that k is a valid positive integer
    % -------------------------------------------------------
    if k < 1 || floor(k) ~= k
        error('k must be a positive integer (1, 2, 3, ...).');
    end

    % -------------------------------------------------------
    % Step 2: Get the number of nodes (routers) in the network
    % -------------------------------------------------------
    n = size(A, 1);   % n = number of rows = number of routers

    % -------------------------------------------------------
    % Step 3: Compute the cumulative power matrix H = A + A^2 + ... + A^k
    %
    % Each power A^p tells us how many paths of exactly p hops exist
    % between two routers. Adding them all up gives us total reachability
    % within k hops.
    % -------------------------------------------------------
    H = zeros(n, n);   % Start with an empty matrix of zeros
    Apow = A;          % Apow will hold A^1, then A^2, then A^3, etc.

    for p = 1 : k
        % On the first loop: Apow = A^1 = A
        % On the second loop: Apow = A^2
        % On the p-th loop: Apow = A^p
        if p == 1
            Apow = A;
        else
            Apow = Apow * A;   % Multiply by A one more time to get next power
        end

        H = H + Apow;          % Add A^p to the running total
    end

    % -------------------------------------------------------
    % Step 4: Convert H into a logical (true/false) reachability matrix
    %
    % If H(i,j) > 0, there is at least one path of length <= k from i to j
    % We only care whether a path EXISTS, not how many there are
    % -------------------------------------------------------
    reachabilityMatrix = H > 0;   % true where reachable, false where not

    % -------------------------------------------------------
    % Step 5: Remove self-reachability (diagonal entries)
    %
    % A router should not count itself as being "at risk" from itself
    % So we set the diagonal to false
    % -------------------------------------------------------
    for i = 1 : n
        reachabilityMatrix(i, i) = false;
    end

    % -------------------------------------------------------
    % Step 6: Count how many routers each router can reach
    %
    % riskCounts(i) = sum of row i = number of routers reachable from i
    % -------------------------------------------------------
    riskCounts = zeros(1, n);   % Pre-allocate a vector of zeros

    for i = 1 : n
        riskCounts(i) = sum(reachabilityMatrix(i, :));   % Count the true values in row i
    end

    % -------------------------------------------------------
    % Step 7: Build riskNodes cell array
    %
    % riskNodes{i} contains the actual indices of routers reachable from i
    % We use find() to get the column indices where the row is true
    % -------------------------------------------------------
    riskNodes = cell(1, n);   % Create an empty cell array with n slots

    for i = 1 : n
        riskNodes{i} = find(reachabilityMatrix(i, :));   % Indices of reachable routers
    end

    % -------------------------------------------------------
    % Step 8: Find the most critical router
    %
    % The most critical router is the one that can reach the MOST other routers.
    % If this router gets infected, malware can spread the furthest.
    % We use max() to find the highest value in riskCounts.
    % -------------------------------------------------------
    [~, mostCritical] = max(riskCounts);   % ~ ignores the max value, we only want the index

    % -------------------------------------------------------
    % Step 9: Find the most vulnerable router
    %
    % The most vulnerable router is the one that can be REACHED BY the most other routers.
    % This means malware from many different sources can arrive at this router.
    % We look at the columns of reachabilityMatrix (how many routers point TO each router).
    % -------------------------------------------------------
    incomingCount = zeros(1, n);   % Will count how many routers can reach each router

    for j = 1 : n
        incomingCount(j) = sum(reachabilityMatrix(:, j));   % Count true values in column j
    end

    [~, mostVulnerable] = max(incomingCount);   % Router with the most incoming reachability

end
